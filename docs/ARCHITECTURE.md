# Architecture overview

- Frontend: React + Vite + TypeScript, PatternFly 5 for UI.
- State: zustand stores for config and YAML.
- API layer: thin fetch helpers to Kubernetes endpoints (CRDs, API groups, resources, namespaces), expecting a proxy at the configured base URL.
- YAML: generated with js-yaml into multi-document output (Role/ClusterRole + Binding).

Key flows
- Discovery: on load, fetch CRDs, core v1, and preferred groupVersions; normalize to a flat list.
- Selection: verbs + resources + scope; subject kind/name (+ namespace for ServiceAccount).
- Generation: group selected resources by apiGroup, build RBAC rules, emit YAML docs and surface in editor pane.

Non-goals (for now)
- Applying changes to a cluster; auth/session management; subresource grants; persistence.
