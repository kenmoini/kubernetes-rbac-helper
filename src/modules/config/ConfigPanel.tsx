import React from 'react'
import { PageSection, Stack, StackItem, Text, TextContent, TextVariants, TextInput, HelperText, HelperTextItem, Button } from '@patternfly/react-core'
import { useAppConfig } from '../../state/config'

export function ConfigPanel() {
  const { baseUrl, setBaseUrl } = useAppConfig()
  const [url, setUrl] = React.useState(baseUrl || '')

  return (
    <PageSection variant="light">
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Text component={TextVariants.h1}>Configuration</Text>
            <Text component={TextVariants.p}>
              For local development, run: <code>kubectl proxy --port=8001</code> and set the API endpoint to <code>http://localhost:8001</code>.
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <TextInput
            value={url}
            onChange={(_, v) => setUrl(v)}
            aria-label="API endpoint"
            placeholder="http://localhost:8001"
          />
          <HelperText>
            <HelperTextItem>Base URL for Kubernetes API (proxied). Tokens are not stored.</HelperTextItem>
          </HelperText>
        </StackItem>
        <StackItem>
          <Button variant="primary" onClick={() => setBaseUrl(url)} isDisabled={!url}>Save</Button>
        </StackItem>
      </Stack>
    </PageSection>
  )
}
