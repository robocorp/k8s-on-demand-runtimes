# On Demand Runtime k8s demo cluster infra

This folder contains the terraform files for setting up the infra required for a demo
cluster for the On Demand Runtime feature of Control Room.

The services configured are the following:

- Kubernetes cluster (Azure Kubernetes Service)
  - nginx-ingress for ingress
  - cert-manager for SSL certs via Letsencrypt
- Container Registry (Azure Container Registry)
- DNS Zones and rules


`terraform init`
`terraform plan -var-file=tfvars-demo`
