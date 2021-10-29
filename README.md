# K8S On-Demand Runtimes 

This repository contains an example implementation of Robocorp On-Demand Runtimes using
a Kubernetes cluster for provisioning the runtimes. This allows for running robots
on customer-hosted infrastructure.

A Detailed description of how the On-Demand Runtime feature works can be found [Here](example.com).

## Repository contents

### Infra

[Infra](infra/) folder contains an example Terraform project that can be used to generate
the required infrastructure for running On-Demand Runtimes on Azure.

### K8S On-Demand Provisioner

[k8s-on-demand-provisioner](k8s-on-demand-provisioner/) folder contains the sources for
a Kubernetes microservice that listens for calls from Robocorp Control Room to start a new runtime.

A pre-built image can be found on (Docker Hub)[https://hub.docker.com/r/robocorp/k8s-on-demand-provisioner]

### Chart
[charts/k8s-on-demand-provisioner/](charts/k8s-on-demand-provisioner/) folder contains the Helm
chart that can be used to deploy the On-demand provisioner and the required service accounts and
roles required by the provisioner.

This repository uses a Github Workflow action to publish the repository on the Github Pages of this repository.
Example of how to use this can be found [below](#simple-install-on-existing-cluster-using-helm)

### Robocontainer

The container that runs the robots is pulled from dockerhub https://hub.docker.com/r/robocorp/robocontainer

## Getting started

### Installation

#### Simple install on existing cluster using Helm

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:

    helm repo add k8s-on-demand-runtimes https://robocorp.github.io/k8s-on-demand-runtimes/

If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run `helm search repo
<alias>` to see the charts.

To install the <chart-name> chart:

    helm install my-k8s-on-demand-provisioner k8s-on-demand-runtimes/k8s-on-demand-provisioner

To uninstall the chart:

    helm delete my-k8s-on-demand-provisioner 

#### Setting up a cluster on Azure, inst

TODO


### Configuring Control Room
