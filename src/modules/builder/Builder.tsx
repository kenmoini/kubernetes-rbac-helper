import React from 'react'
import { PageSection, Title, Grid, GridItem, Form, FormGroup, Checkbox, Select, SelectList, SelectOption, TextInput, Button, ChipGroup, Chip, Divider } from '@patternfly/react-core'
import { useAppConfig } from '../../state/config'
import { useYamlStore } from '../yaml/yamlStore'

const ALL_VERBS = ['get','list','watch','create','update','patch','delete','deletecollection']

export function Builder() {
  const { baseUrl } = useAppConfig()
  const { setYaml } = useYamlStore()

  const [isClusterScope, setIsClusterScope] = React.useState(false)
  const [selectedVerbs, setSelectedVerbs] = React.useState<string[]>(['get','list','watch'])
  const [subjectKind, setSubjectKind] = React.useState<'ServiceAccount' | 'User' | 'Group'>('ServiceAccount')
  const [subject, setSubject] = React.useState('')
  const [subjectNamespace, setSubjectNamespace] = React.useState('default')
  const [namespaces, setNamespaces] = React.useState<string[]>([])
  const [nsSelectOpen, setNsSelectOpen] = React.useState(false)

  // PLACEHOLDER: resources selection will be driven by CRD list
  const [resources] = React.useState<Array<{group: string, version: string, resource: string}>>([])

  const toggleVerb = (verb: string) => {
    setSelectedVerbs(v => v.includes(verb) ? v.filter(x => x !== verb) : [...v, verb])
  }

  const onGenerate = () => {
    // Minimal placeholder YAML until resource/namespace wiring is done
    const roleKind = isClusterScope ? 'ClusterRole' : 'Role'
    const bindingKind = isClusterScope ? 'ClusterRoleBinding' : 'RoleBinding'
    const name = `generated-${roleKind.toLowerCase()}`

    const role: any = {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: roleKind,
      metadata: { name },
      rules: [
        {
          apiGroups: ['*'],
          resources: ['*'],
          verbs: selectedVerbs
        }
      ]
    }

    const subjectBlock: any = {
      kind: subjectKind,
      name: subject,
      ...(subjectKind === 'ServiceAccount' && !isClusterScope ? { namespace: subjectNamespace } : {})
    }

    const binding: any = {
      apiVersion: 'rbac.authorization.k8s.io/v1',
      kind: bindingKind,
      metadata: { name: `${name}-binding` },
      subjects: [subjectBlock],
      roleRef: { apiGroup: 'rbac.authorization.k8s.io', kind: roleKind, name }
    }

    const docs = [role, binding]
    const yaml = docs.map(d => `---\n${toYaml(d)}`).join('\n')
    setYaml(yaml)
  }

  return (
    <PageSection>
      <Title headingLevel="h1">RBAC Builder</Title>
      {!baseUrl && <div style={{ marginTop: 16 }}>No API endpoint configured. Open the Config page to set http://localhost:8001 (via kubectl proxy).</div>}
      <Divider style={{ margin: '16px 0' }} />
      <Grid hasGutter>
        <GridItem span={12} lg={6}>
          <Form>
            <FormGroup label="Scope" fieldId="scope">
              <Checkbox id="scope-cluster" label="Cluster-scoped" isChecked={isClusterScope} onChange={(_, v) => setIsClusterScope(v)} />
            </FormGroup>

            {!isClusterScope && (
              <FormGroup label="Namespaces" fieldId="namespaces">
                <Select
                  id="ns-select"
                  isOpen={nsSelectOpen}
                  onOpenChange={setNsSelectOpen}
                  selectionMode="multiple"
                  selected={namespaces}
                  onSelect={(_, value) => {
                    const v = String(value)
                    setNamespaces(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])
                  }}
                >
                  <SelectList>
                    {['default','kube-system','kube-public'].map(ns => (
                      <SelectOption key={ns} value={ns}>{ns}</SelectOption>
                    ))}
                  </SelectList>
                </Select>
                <ChipGroup>
                  {namespaces.map(ns => (
                    <Chip key={ns} onClick={() => setNamespaces(namespaces.filter(n => n !== ns))}>{ns}</Chip>
                  ))}
                </ChipGroup>
              </FormGroup>
            )}

            <FormGroup label="Verbs" fieldId="verbs">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {ALL_VERBS.map(v => (
                  <Checkbox key={v} id={`verb-${v}`} label={v} isChecked={selectedVerbs.includes(v)} onChange={() => toggleVerb(v)} />
                ))}
              </div>
            </FormGroup>

            <FormGroup label="Subject kind" fieldId="subject-kind">
              <Select
                id="subject-kind"
                selected={subjectKind}
                onSelect={(_, value) => setSubjectKind(value as any)}
              >
                <SelectList>
                  {['ServiceAccount','User','Group'].map(k => (
                    <SelectOption key={k} value={k}>{k}</SelectOption>
                  ))}
                </SelectList>
              </Select>
            </FormGroup>

            {subjectKind === 'ServiceAccount' && !isClusterScope && (
              <FormGroup label="SA namespace" fieldId="sa-ns">
                <TextInput id="sa-ns" value={subjectNamespace} onChange={(_, v) => setSubjectNamespace(v)} />
              </FormGroup>
            )}

            <FormGroup label="Subject name" fieldId="subject-name">
              <TextInput id="subject-name" value={subject} onChange={(_, v) => setSubject(v)} placeholder={subjectKind === 'ServiceAccount' ? 'service-account-name' : 'username or group'} />
            </FormGroup>

            <Button variant="primary" onClick={onGenerate} isDisabled={!subject}>Generate YAML</Button>
          </Form>
        </GridItem>
        <GridItem span={12} lg={6}>
          <Title headingLevel="h2">Resources</Title>
          <div>Resource picker coming next (CRDs list).</div>
        </GridItem>
      </Grid>
    </PageSection>
  )
}

function toYaml(obj: unknown): string {
  // Lightweight inline YAML for simple docs to avoid bringing in generator here.
  // We will switch to js-yaml for the full implementation later.
  // Using JSON -> YAML-ish basic conversion for now.
  // This is a placeholder to keep the vertical slice working.
  const jsYaml = (globalThis as any).jsyaml
  if (jsYaml && jsYaml.dump) {
    return jsYaml.dump(obj)
  }
  return JSON.stringify(obj, null, 2)
}
