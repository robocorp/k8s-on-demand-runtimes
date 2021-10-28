
resource "azurerm_container_registry" "acr" {
  name                     = var.name
  resource_group_name      = var.rg_name
  location                 = var.location
  sku                      = "Basic"
  admin_enabled            = true
}

resource "azurerm_role_assignment" "aks_to_acr" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = var.cluster_principal_id
  skip_service_principal_aad_check = true
  lifecycle {
    ignore_changes = [skip_service_principal_aad_check]
  }
}
