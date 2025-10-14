export type ApiConfig = {
  baseUrl: string
}

export type SubjectKind = 'ServiceAccount' | 'User' | 'Group'

export type RbacSelection = {
  scope: 'Namespaced' | 'Cluster'
  namespaces: string[]
  resources: Array<{ group: string; version: string; resource: string }>
  verbs: string[]
  subjects: Array<{ kind: SubjectKind; name: string; namespace?: string }>
}
