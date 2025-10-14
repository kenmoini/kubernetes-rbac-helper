import React from 'react'
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, Button } from '@patternfly/react-core'
import { CodeEditor, Language } from '@patternfly/react-code-editor'
import { useYamlStore } from './yamlStore'

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
      <div style={{ display: 'flex', gap: 8, padding: 8 }}>
        <Button variant="secondary" onClick={onCopy}>Copy</Button>
        <Button variant="secondary" onClick={onDownload}>Download</Button>
      </div>
      <CodeEditor
        isLineNumbersVisible
        isReadOnly={false}
        isMinimapVisible={false}
        isDarkTheme={false}
        code={yaml}
        language={Language.yaml}
        onChange={(_, value) => setYaml(value)}
        height="100%"
      />
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
