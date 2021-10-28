output "name_servers" {
  value = {
    zone = var.dns.zone
    nameservers = azurerm_dns_zone.zone.name_servers
  }
}
