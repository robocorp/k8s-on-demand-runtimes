output "dns_name_servers" {
  value = module.dns.name_servers
}

output "ingress_ip" {
  value = module.kubernetes.ingress_ip
}
