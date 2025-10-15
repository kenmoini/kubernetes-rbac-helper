# Architectural Decisions and Scope

This document records key decisions and constraints for the initial build.

- Stack: TypeScript + React + Vite + PatternFly 5
- Distribution: Standalone web app first; later adaptable to OpenShift Console dynamic plugin
- Auth/Connectivity (dev): use `kubectl proxy` (no CORS/TLS issues); tokens not persisted
- Scope: Support both namespaced and cluster-scoped RBAC; omit subresources like `status`/`finalizers` for now
- Subjects: ServiceAccounts, Users, and Groups
- Verbs: Provide all standard verbs: get, list, watch, create, update, patch, delete, deletecollection
- YAML: Generate multi-document YAML; live-edit in sidebar; allow copy and download
- Namespace scoping: Prefer explicit namespace selection with searchable pick-list to avoid accidental cluster-wide grants
- Persistence: Ephemeral; do not store preferences or credentials; follow OS theme by default
- Licensing: TBD (intentionally omitted for now)
- Project name: kubernetes-rbac-helper

Future considerations
- Resource picker backed by CRD discovery (and possibly core resources)
- js-yaml based generators for Role/ClusterRole and Bindings
- Optional Node dev proxy if we need to accept explicit SA tokens
- Plugin packaging as OpenShift Console dynamic plugin
- Tests for YAML generation logic
