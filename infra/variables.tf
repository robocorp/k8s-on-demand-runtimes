variable "deployment_name" {
  type = string
}
variable "location" {
  type = string
}
variable "acr_location" {
  type = string
  default = null
}
variable "aks_location" {
  type = string
  default = null
}

variable "acr_name" {
  type = string
}

variable "aks_vm_size" {
  type = string
}
variable "aks_availability_zones" {
  type = list(string)
}
variable "aks_default_node_count" {
  type = number
}
variable "kubernetes_version" {
  type = string
}

variable "dns" {
  type = object({
    zone = string
    a_record = string
  })
}

variable "cluster_issuer_email" {
  type = string
}
