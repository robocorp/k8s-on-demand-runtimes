# On Demand Runtime k8s demo cluster infra

Folder `infra` contains Terraform files that create the required Azure resources
for testing this example implementation.

The services configured are the following:

- Kubernetes cluster (Azure Kubernetes Service)
  - nginx-ingress for ingress
  - cert-manager for SSL certs via Letsencrypt
- Container Registry (Azure Container Registry) (not strictly needed if only
  using containers from dockerhub)
- Static IP for kubernetes Ingress
- DNS Zone and rule for the Kuberness Ingress static IP

To run this terraform project, authentication with Azure is needed. That can be
done by having the azure cli client installed and authenticated. Details can be
found on
[Terraform documentation](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/guides/azure_cli)

The variables used in the creation of the resources are stored in the
`tfvars-demo` file. The variables need to be adjusted for new instances.

    terraform init
    terraform apply -var-file=tfvars-demo
