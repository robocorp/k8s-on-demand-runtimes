resource "kubernetes_namespace" "ingress-nginx" {
  metadata {
    annotations = {
      name = "ingress-nginx"
    }
    name = "ingress-nginx"
  }
}

//https://kubernetes.github.io/ingress-nginx/
resource "helm_release" "ingress-nginx" {
  name       = "ingress-nginx"
  chart      = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  version    = "4.0.1"
  cleanup_on_fail = true
  namespace = kubernetes_namespace.ingress-nginx.metadata[0].name

  set {
    name  = "rbac.create"
    value = "true"
  }
  set {
    name  = "controller.service.type"
    value = "LoadBalancer"
  }
  set {
    name  = "controller.service.loadBalancerIP"
    value = azurerm_public_ip.ingress.ip_address
  }
}

// https://registry.terraform.io/modules/terraform-iaac/cert-manager/kubernetes
module "cert_manager" {
  source        = "terraform-iaac/cert-manager/kubernetes"
  version = "2.0.6"
  cluster_issuer_email                   = var.cluster_issuer_email
  cluster_issuer_name                    = "cert-manager-global"
  cluster_issuer_private_key_secret_name = "cert-manager-private-key"
}

resource "azurerm_public_ip" "ingress" {
  name                = "${var.aks_name}-ingress"
  location            = var.location
  resource_group_name = var.aks_node_rg_name
  allocation_method   = "Static"
  sku                 = "Standard"
}
