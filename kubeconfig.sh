#!/bin/bash

# Ensure required arguments are provided
if [ "$#" -ne 3 ]; then
    echo "Usage: $0 <name> <certificate-authority-data> <oidc-client-id>"
    exit 1
fi

# Assign arguments to variables
NAME=$1
OIDC_CLIENT_ID=$2
CERT_AUTH_DATA=$3

# Construct API server URL
API_SERVER="https://api.${NAME}.k3sphere.io"

# Set Kubernetes cluster
kubectl config set-cluster "$NAME" --server="$API_SERVER"

# Manually set the certificate-authority-data
kubectl config set "clusters.${NAME}.certificate-authority-data" "$CERT_AUTH_DATA"

# Set Kubernetes user with OIDC authentication
kubectl config set-credentials "$NAME" \
  --exec-api-version=client.authentication.k8s.io/v1beta1 \
  --exec-command=kubelogin \
  --exec-arg=get-token \
  --exec-arg=--oidc-issuer-url=https://auth.k3sphere.com/realms/k3sphere \
  --exec-arg=--oidc-client-id="$OIDC_CLIENT_ID" \
  --exec-arg=--oidc-extra-scope=email \
  --exec-interactive-mode=IfAvailable \
  --exec-provide-cluster-info=false

# Set Kubernetes context
kubectl config set-context "$NAME" \
  --cluster="$NAME" \
  --user="$NAME"

# Use the newly created context
kubectl config use-context "$NAME"

# Confirmation message
echo "Kubernetes config for '$NAME' has been set successfully."
