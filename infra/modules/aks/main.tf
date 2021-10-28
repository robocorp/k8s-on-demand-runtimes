resource "azurerm_kubernetes_cluster" "cluster" {
  name                = var.name
  location            = var.location
  resource_group_name = var.rg_name
  dns_prefix          = "${var.name}-dns"
  kubernetes_version  = var.kubernetes_version

  default_node_pool {
    availability_zones = var.availability_zones
    name       = "agentpool"
    node_count = var.default_node_count
    vm_size    = var.vm_size
  }

  identity {
    type = "SystemAssigned"
  }
  role_based_access_control {
    enabled = true
  }
}

