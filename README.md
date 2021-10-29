# K8S On-Demand Runtimes 

This repository contains an example implementation of Robocorp On-Demand Runtimes using
a Kubernetes cluster for provisioning the runtimes. This allows for running robots
on customer-hosted infrastructure.


## Infra (Terraform)

Folder `infra` contains Terraform files that create the required Azure resources for testing this
example implementation.

The services configured are the following:
- Kubernetes cluster (Azure Kubernetes Service)
  - nginx-ingress for ingress
  - cert-manager for SSL certs via Letsencrypt
- Container Registry (Azure Container Registry) (TODO: May not be needed anymore)
- DNS Zones and rules

The variables used in the creation of the resources are stored in the `tfvars-demo` file. The
variables here need to be changed for new instances.

`terraform init`
`terraform plan -var-file=tfvars-demo`

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

## Robocontainer

The container that runs the robots is pulled from dockerhub https://hub.docker.com/r/robocorp/robocontainer

TODO: add sources for building robocontainer to repository

