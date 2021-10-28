resource "azurerm_dns_zone" "zone" {
  name                = var.dns.zone
  resource_group_name = var.rg_name
}

resource "azurerm_dns_a_record" "record" {
  name                = var.dns.a_record
  zone_name           = azurerm_dns_zone.zone.name
  resource_group_name = azurerm_dns_zone.zone.resource_group_name
  ttl                 = 3600
  records = [
    var.ip
  ]

 depends_on = [
    azurerm_dns_zone.zone
  ]
}
