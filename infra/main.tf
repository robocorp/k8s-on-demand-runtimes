provider "kubernetes" {
  host                   = module.aks.endpoint
  client_key             = base64decode(module.aks.client_key)
  client_certificate     = base64decode(module.aks.client_cert)
  cluster_ca_certificate = base64decode(module.aks.ca_cert)
}


provider "helm" {
  kubernetes {
    host                   = module.aks.endpoint
    client_key             = base64decode(module.aks.client_key)
    client_certificate     = base64decode(module.aks.client_cert)
    cluster_ca_certificate = base64decode(module.aks.ca_cert)
  }
}

resource "azurerm_resource_group" "deployment"{
  name = "ondemandk8s-${var.deployment_name}"
    location = var.location
}

module "aks" {
  source = "./modules/aks"
  name = "ondemandk8s-aks-${var.deployment_name}"
  default_node_count = var.aks_default_node_count
  rg_name = azurerm_resource_group.deployment.name
  location = coalesce(var.aks_location, var.location)
  rg_id = azurerm_resource_group.deployment.id
  availability_zones = var.aks_availability_zones
  kubernetes_version = var.kubernetes_version
  vm_size = var.aks_vm_size
}

module "acr" {
  source = "./modules/acr"
  name = var.acr_name
  rg_name = azurerm_resource_group.deployment.name
  location = coalesce(var.acr_location, var.location)
  cluster_principal_id = module.aks.cluster_principal_id
}

module "kubernetes" {
  source = "./modules/kubernetes"
  aks_name = "ondemandk8s-aks-${var.deployment_name}"
  location = coalesce(var.aks_location, var.location)
  aks_node_rg_name = module.aks.node_rg_name
  cluster_issuer_email = var.cluster_issuer_email
}

module "dns" {
  source = "./modules/dns"
  dns = var.dns
  rg_name = azurerm_resource_group.deployment.name
  ip = module.kubernetes.ingress_ip
}
