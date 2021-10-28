variable "kubernetes_version" {
  type = string
}

variable "name" {
  type = string
}

variable "availability_zones" {
  type = list(string)
}

variable "vm_size" {
  type = string
}

variable "default_node_count" {
  type = number
}

variable "rg_name" {
  type = string
}

variable "rg_id" {
  type = string
}

variable "location" {
  type = string
}
