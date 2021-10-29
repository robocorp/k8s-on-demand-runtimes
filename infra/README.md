# On Demand Runtime k8s demo cluster infra

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

