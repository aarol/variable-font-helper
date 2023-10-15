import { Anchor, Button, Group, List, Text, TextInput, Title } from '@mantine/core'
import React, { Suspense, useState } from 'react'
import { downloadAllFiles, fontFaceIdentifier, Stylesheet } from '../api'
const Highlight = React.lazy(() => import('./Highlight'))
import '@mantine/code-highlight/styles.css'

const renderStylesheets = (styles: Stylesheet[], url: string, fontName: string) => {
  if (styles.length == 0) return ''

  if (styles.length == 1) {
    return styles[0].raw.replace(styles[0].url, url)
  } else {
    return styles.map(style =>
      style.raw.replace(style.url,
        // replace generic url with that of the subset
        url.replace(fontName, `${fontName}-${fontFaceIdentifier(style)}`)
      )
    ).join('\n')
  }
}

export const Output = ({ styles, fontName }: { styles: Stylesheet[], fontName: string }) => {

  const [url, setUrl] = useState(`../${fontName}.woff2`)

  const downloadFonts = async () => {
    downloadAllFiles(fontName, styles)
  }

  const css = renderStylesheets(styles, url, fontName)

  return (
    <>
      <Title order={2} pb="sm">Output</Title>
      <List>
        {styles.sort((a, b) => a.subset.localeCompare(b.subset)).map(style => (
          <List.Item key={fontFaceIdentifier(style)}>
            <Anchor styles={{ root: { overflowWrap: 'break-word' } }} href={style.url}>{fontFaceIdentifier(style)}</Anchor>
          </List.Item>
        ))}
      </List>
      <Group py="md">
        <Button onClick={downloadFonts}>Download All</Button>
      </Group>
      <TextInput value={url} label="CSS import url" onChange={(e) => setUrl(e.target.value)} />
      <Suspense fallback={<Text>Loading...</Text>}>
        <Highlight my="sm" key={css} language="css" code={css} />
      </Suspense>
    </>
  )
}