import type { ApiConfig } from '../types'

export async function fetchCRDs(baseUrl: string): Promise<any> {
  const url = `${baseUrl.replace(/\/$/, '')}/apis/apiextensions.k8s.io/v1/customresourcedefinitions`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to fetch CRDs: ${res.status} ${res.statusText}`)
  }
  return res.json()
}
