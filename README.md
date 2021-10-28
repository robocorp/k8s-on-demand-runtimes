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
- Container Registry (Azure Container Registry)
- DNS Zones and rules

The variables used in the creation of the resources are stored in the `tfvars-demo` file. The
variables here need to be changed for new instances.

`terraform init`
`terraform plan -var-file=tfvars-demo`

## Provisioner Service

Folder `k8s-on-demand-provisioner` contains the provisioner implementation for on-demand runtimes.


### Deployment

`skaffold deploy -p dev --namespace <namespace-to-deploy> --images robocorp/k8s-on-demand-provisioner:latest`

## Robocontainer

The container that runs the robots is pulled from dockerhub https://hub.docker.com/r/robocorp/robocontainer

TODO: add sources for building robocontainer to repo

