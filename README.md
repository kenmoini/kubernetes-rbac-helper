# OCP RBAC Builder

An ephemeral, local-only web UI to build Kubernetes/OpenShift RBAC YAML from selected resources, verbs, scope, and subjects. Designed to later evolve into an OpenShift Console dynamic plugin.

Status: pre-alpha (vertical slice)

Quick start (Podman containerized dev)
1) Create and enter the project directory
- mkdir -p /Users/lee/git/ocp-rbac-builder

2) Run dev dependencies in a Podman container (no global installs)
- podman run --rm -it \
  -v /Users/lee/git/ocp-rbac-builder:/workspace \
  -w /workspace \
  -p 5173:5173 \
  docker.io/library/node:20-bookworm bash -lc "npm run dev -- --host 0.0.0.0"

3) In another terminal, run a local Kubernetes API proxy (no CORS issues):
- kubectl proxy --port=8001

4) Open the app at http://localhost:5173
- Go to Config and set API endpoint: http://localhost:8001

Notes
- No tokens or preferences are persisted. Theme follows OS by default.
- YAML can be edited live in the sidebar, copied to clipboard, or downloaded as a single multi-doc file for GitOps or manual oc apply.

Roadmap
- CRD discovery and resource picker with namespace scoping
- Full Role/ClusterRole and Binding YAML generation using js-yaml
- Namespaces pick-list with search powered by API
- Optional dev container config (VS Code) and automated tests

Security
- This UI does not apply changes to a cluster. It only generates YAML. Use kubectl proxy or a local dev proxy to avoid exposing credentials in the browser. Tokens are never stored.
