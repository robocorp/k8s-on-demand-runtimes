## Provisioner Service

The provisioner implementation relies on skaffold and a helm chart.

What is built:

- Builds a docker image `robocorp/k8s-on-demand-provisioner`

What is deployed via helm chart:

- A Kubernetes secret that stores the secret used for communication between the
  Control Room and the cluster
- A deployment and service that uses the image built above
- Required service accounts and roles that allow the deployment above to create
  kubernetes jobs
- An ingress controller rule that connects the provisioner to the outside world

### Build command examples

These commands require kubectl and helm to be installd and configured.
Deployment will be done to the cluster which is configured into the currently
active kubectl context

Build image, push images to repo given as parameter and deploy to current
kubectl context.

    skaffold run --default-repo <acr_name>.azurecr.io

Same as above, but push a container that uses `ts-node-dev` to live-reload the
project when sources change and enable live syncing of sources to the container
using Skaffold. This allows for near-instant updating of the kubernetes
deployment for development purposes.

    skaffold dev --default-repo <acr_name>.azurecr.io -p dev

Deploy using prebuilt image from dockerhub.

    skaffold deploy -p dev --images robocorp/k8s-on-demand-provisioner:latest
