import { format } from 'util';

export interface StartContainerInput {
  workspaceId: string;
  runtimeId: string;
  runtimeLinkToken: string;
  imageUri: string;
  clusterName?: string;
  condaYmlEndpoint?: string;
  memoryReservation?: number;
  cpuReservation?: number;
  timeoutSeconds?: number;
}
export interface ContainerService {
  /**
   * Starts up a new container. Returns a unique resource identifier
   * related to that particular running container.
   * @param params 
   */
  startContainer(params: StartContainerInput): Promise<string>;
  
  /**
   * Stops the container running the specified runtime. Returns the identifier
   * of the stopped container.
   * @param workspaceId Workspace id
   * @param runtimeId Runtime id
   */
  // XXX workspaceId is not used
  stopContainerByRuntimeId(workspaceId: string, runtimeId: string): Promise<string>;

  
  /**
   * Resolves the container running the specified runtime. Returns the
   * identifier of the stopped container.
   * @param workspaceId Workspace id
   * @param runtimeId Runtime id
   */
  // XXX workspaceId is not used
  getContainerIdByRuntimeId(workspaceId: string, runtimeId: string);


  /**
   * Checks if the specified container has been terminated.
   * @param workspaceId Unique id specifying the container
   */
  isContainerTerminated(taskArn: string): Promise<boolean>;
}

export class ContainerProvisioningError extends Error {
  runtimeId?: string;

  constructor(msg: string, runtimeId?: string) {
    super(msg);
    this.runtimeId = runtimeId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
