import type { ApiConfig } from '../types'

export async function fetchCRDs(baseUrl: string): Promise<any> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis/apiextensions.k8s.io/v1/customresourcedefinitions`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch CRDs: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchNamespaces(baseUrl: string): Promise<string[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/v1/namespaces`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch namespaces: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const items = Array.isArray(data.items) ? data.items : []
  return items.map((i: any) => i?.metadata?.name).filter((n: any) => typeof n === 'string')
}

export async function fetchApiGroups(baseUrl: string): Promise<any[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch API groups: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  return Array.isArray(data.groups) ? data.groups : []
}

export async function fetchApiResourceList(baseUrl: string, groupVersion: string): Promise<any> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis/${groupVersion}`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch resources for ${groupVersion}: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchCoreV1Resources(baseUrl: string): Promise<any> {
  const url = `${baseUrl.replace(/\/$/, '')}/api/v1`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch core v1 resources: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

// OpenShift-only convenience; return [] when not available (e.g., vanilla k8s)
export async function fetchOpenShiftUsers(baseUrl: string): Promise<string[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis/user.openshift.io/v1/users`
  const res = await fetch(url)
  if (res.status === 404) return []
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenShift users: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const items = Array.isArray(data.items) ? data.items : []
  return items.map((i: any) => i?.metadata?.name).filter((n: any) => typeof n === 'string')
}

export async function fetchOpenShiftGroups(baseUrl: string): Promise<string[]> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis/user.openshift.io/v1/groups`
  const res = await fetch(url)
  if (res.status === 404) return []
  if (!res.ok) {
    throw new Error(`Failed to fetch OpenShift groups: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const items = Array.isArray(data.items) ? data.items : []
  return items.map((i: any) => i?.metadata?.name).filter((n: any) => typeof n === 'string')
}

export async function fetchServiceAccounts(baseUrl: string, namespace: string): Promise<string[]> {
  const ns = namespace || 'default'
  const url = `${baseUrl.replace(/\/$/, '')}/api/v1/namespaces/${encodeURIComponent(ns)}/serviceaccounts`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch ServiceAccounts in ${ns}: ${res.status} ${res.statusText}`)
  }
  const data = await res.json()
  const items = Array.isArray(data.items) ? data.items : []
  return items.map((i: any) => i?.metadata?.name).filter((n: any) => typeof n === 'string')
}
