output "client_cert" {
  value = azurerm_kubernetes_cluster.cluster.kube_config.0.client_certificate
}

output "client_key" {
  value = azurerm_kubernetes_cluster.cluster.kube_config.0.client_key
}

output "ca_cert" {
  value = azurerm_kubernetes_cluster.cluster.kube_config.0.cluster_ca_certificate
}

output "endpoint" {
  value = azurerm_kubernetes_cluster.cluster.kube_config.0.host
}

output "id" {
  value = azurerm_kubernetes_cluster.cluster.id
}

output "node_rg_name" {
  value = azurerm_kubernetes_cluster.cluster.node_resource_group
}

output "cluster_principal_id" {
  value = azurerm_kubernetes_cluster.cluster.kubelet_identity[0].object_id
}
