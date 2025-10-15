# Quickstart

Containerized dev server:

```
podman run --rm -it \
  -v $(pwd):/workspace \
  -w /workspace \
  -p 5173:5173 \
  docker.io/library/node:20-bookworm bash -lc "npm install && npm run dev -- --host 0.0.0.0"
```

Cluster API proxy:

```
kubectl proxy --port=8001
```

Open http://localhost:5173 and set Config → API endpoint to `http://localhost:8001`.
