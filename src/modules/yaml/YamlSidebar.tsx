import React from 'react'
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, Button, TextArea } from '@patternfly/react-core'
import { useYamlStore } from './yamlStore'

// Lazy-load the heavy editor; fall back to a simple textarea if it fails
const LazyCodeEditor = React.lazy(async () => {
  const mod = await import('@patternfly/react-code-editor')
  // Default export shim to use <LazyCodeEditor /> directly
  return { default: mod.CodeEditor }
})

function EditorFallback({ yaml, setYaml }: { yaml: string; setYaml: (y: string) => void }) {
  return (
    <div style={{ padding: 8 }}>
      <TextArea value={yaml} onChange={(_, v) => setYaml(v)} resizeOrientation="vertical" style={{ height: 'calc(100vh - 200px)' }} />
    </div>
  )
}

class EditorBoundary extends React.Component<{ fallback: React.ReactNode } & React.PropsWithChildren, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

export function YamlSidebar({ isOpen, onClose, children }: React.PropsWithChildren<{ isOpen: boolean; onClose: () => void }>) {
  const { yaml, setYaml } = useYamlStore()

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml)
    } catch {}
  }

  const onDownload = () => {
    const blob = new Blob([yaml], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'rbac.yaml'
    a.click()
    URL.revokeObjectURL(url)
  }

  const panelContent = (
    <DrawerPanelContent widths={{ default: 'width_33' }}>
      <div style={{ display: 'flex', gap: 8, padding: 8, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={onCopy}>Copy</Button>
          <Button variant="secondary" onClick={onDownload}>Download</Button>
        </div>
        <div>
          <Button variant="link" onClick={onClose}>Collapse</Button>
        </div>
      </div>
      <div style={{ padding: '0 8px 8px', color: '#6a6e73' }}>
        <small>YAML is editable here. Your edits are used by Copy and Download.</small>
      </div>
      <EditorBoundary fallback={<EditorFallback yaml={yaml} setYaml={setYaml} />}>
        <React.Suspense fallback={<EditorFallback yaml={yaml} setYaml={setYaml} />}>
          <LazyCodeEditor
            isLineNumbersVisible
            isReadOnly={false}
            isMinimapVisible={false}
            isDarkTheme={false}
            code={typeof yaml === 'string' ? yaml : String(yaml ?? '')}
            language={"yaml" as any}
            onChange={(value: any) => {
              const text = typeof value === 'string' ? value : String(value ?? '')
              setYaml(text)
            }}
            height="100%"
          />
        </React.Suspense>
      </EditorBoundary>
    </DrawerPanelContent>
  )

  return (
    <Drawer isExpanded={isOpen} onExpand={() => {}}>
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>{children}</DrawerContentBody>
      </DrawerContent>
    </Drawer>
  )
}
