## Provisioner Service

Folder `k8s-on-demand-provisioner` contains the provisioner implementation for on-demand runtimes.

The provisioner implementation relies on skaffold and a helm chart. 

What is built:
 - Builds a docker image called `robocorp/k8s-on-demand-provisioner`

What is deployed via helm chart:
 - A Kubernetes secret that stores the secret used for communication between the Control Room and 
   the cluster
 - A deployment and service that uses the image built above
 - Required service accounts and roles that allow the deployment above to create kubernetes jobs
 - An ingress controller rule that connects the provisioner to the outside world

`skaffold deploy -p dev --namespace <namespace-to-deploy> --images robocorp/k8s-on-demand-provisioner:latest`

