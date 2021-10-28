/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-return-await */
import { BatchV1Api, KubeConfig } from "@kubernetes/client-node";
import { Logger } from "../logging";
import { ContainerService, StartContainerInput } from "./ContainerService";
import { NoopLogger } from "../logging";

interface K8SContainerServiceConfig {
  runtimeNamespace?: string;
  logger?: Logger;
}

/**
 * Function that can be used to construct uniform logical identifiers
 * for the runtime containers. Should uniquely identify a container.
 *
 * There are both syntax and length (<= 63 chars) requirements from Kubernetes.
 * Basically this needs to be a valid DNS name.
 */
export const buildContainerLogicalId = (rt: string) => `runtime-${rt}`;

/**
 * Manages runtime containers on a Kubernetes cluster.
 */
export class K8SContainerService implements ContainerService {
  private logger: Logger;
  private kubernetesConfig: KubeConfig;
  private kubernetesBatchClient: BatchV1Api;
  private runtimeNamespace: string;

  constructor(private cfg: K8SContainerServiceConfig) {
    this.logger = cfg.logger ?? NoopLogger;

    this.runtimeNamespace =
      cfg.runtimeNamespace ??
      process.env.KUBERNETES_RUNTIME_NAMESPACE ??
      "default";

    this.kubernetesConfig = new KubeConfig();

    // The following by default loads the service account configuration from
    // the default location on a running Pod, namely from
    // /var/run/secrets/kubernetes.io/serviceaccount/
    //
    // This works when this program is running within Kubernetes.
    this.kubernetesConfig.loadFromCluster();

    this.kubernetesBatchClient =
      this.kubernetesConfig.makeApiClient(BatchV1Api);
  }

  async startContainer(params: StartContainerInput): Promise<string> {
    const runtimeLogicalId = buildContainerLogicalId(params.runtimeId);

    const image = params.imageUri;

    // this.logger.info('Starting task with params:', JSON.stringify(request));
    const jobPostResult = await this.kubernetesBatchClient.createNamespacedJob(
      this.runtimeNamespace,
      {
        metadata: {
          // NOTE: you can't have many jobs with the same name running in the
          // cluster, so IF we want to allow duplicates of these job requests
          // to be made, we need to add some random component to the logical id
          name: runtimeLogicalId,
          labels: {
            workspaceId: params.workspaceId,
            runtimeId: params.runtimeId,
          },
        },
        spec: {
          template: {
            metadata: {
              labels: {
                workspaceId: params.workspaceId,
                runtimeId: params.runtimeId,
              },
            },
            spec: {
              containers: [
                {
                  name: `rc-on-demand-runtime-${params.runtimeId}`,
                  image: image,
                  resources: {
                    // More on these at
                    // https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
                    requests: {
                      // ensure that the container gets _at least_ 256MBs of mem
                      memory: "256M",
                      // ensure that the container gets some fair share of
                      // available CPU time
                      cpu: "250m", // 250 "millicpus"
                    },
                  },
                  env: [
                    {
                      name: "RC_WORKER_NAME",
                      value: runtimeLogicalId,
                    },
                    {
                      name: "RC_WORKER_LINK_TOKEN",
                      value: params.runtimeLinkToken,
                    },
                    // NOT IN USE currently for k8s runtimes
                    // {
                    //   name: 'RC_CONDA_ENDPOINT',
                    //   value: params.condaYmlEndpoint,
                    // },
                    {
                      name: "ROBOCORP_HOME",
                      value: process.env.WORKER_HOME_FOLDER,
                    },
                    // This controls the RC agent termination after the activity
                    // run i.e. the time the agent waits before shutting down
                    // after execution. This is currently required for
                    // controlling the termination as otherwise the ECS tasks
                    // don't terminate gracefully and this blocks execution of
                    // new ECS tasks on the same ECS agent.
                    {
                      name: "RC_AGENT_TERMINATE_AFTER_RUN_MS",
                      value:
                        process.env.RC_AGENT_TERMINATE_AFTER_RUN_MS || "5000",
                    },
                  ],
                },
              ],
              restartPolicy: "Never",
            },
          },
          // Schedule kubernetes to kill the job pods if the runtime is active
          // for more than 24 hrs and 1 minute. The max running time for a run
          // is 24 hours, so the additional "1 min" provides a small window for
          // any possibly occurring graceful shutdown by some other mechanism
          activeDeadlineSeconds: params.timeoutSeconds ?? 86460,
          // Instruct kubernetes to remove the Job resource altogether after it
          // has been completed (basically the runtime has exited by one way or
          // another), so we don't pile up dead resources at the storage backend
          // for kubernetes api server. A large amount of useless garbage would
          // hinder the performance of the kubernetes control plane.
          ttlSecondsAfterFinished: 3600,
          // Consider the Job failed immediately without retrying. This is
          // because the nature of the container is such that, bar network
          // failures, one of three things is generally going on:
          // 1) system is improperly configured -> no amount of retries mends
          //    this
          // 2) runtime agent crashes before linking (probably due to point 1)
          //    -> again, not retryable
          // 3) runtime agent crashes after linking -> the one-time link token
          //    has been used -> any rebooted container will fail
          backoffLimit: 0,
        },
      }
    );

    // the k8s client already throws if result is an error response

    return jobPostResult.body.metadata.name;
  }

  // XXX workspaceId is not used
  async stopContainerByRuntimeId(
    workspaceId: string,
    runtimeId: string
  ): Promise<string> {
    const runtimeLogicalId = buildContainerLogicalId(runtimeId);

    // TODO: check if the request was successful
    return runtimeLogicalId;
  }

  // XXX workspaceId is not used
  async getContainerIdByRuntimeId(workspaceId: string, runtimeId: string) {
    const runtimeLogicalId = buildContainerLogicalId(runtimeId);

    return runtimeLogicalId;
  }

  async isContainerTerminated(runtimeLogicalId: string): Promise<boolean> {
    // we probably do not need this for k8s since timeouts are managed by
    // kubernetes
    throw new Error("Not implemented");
  }
}
