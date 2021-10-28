variable "dns" {
  type = object({
    zone = string
    a_record = string
  })
}

variable "ip" {
  type = string
}

variable "rg_name" {
  type = string
}
