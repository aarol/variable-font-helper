import { Anchor, Button, Group, List, TextInput, Title } from '@mantine/core'
import { Prism } from '@mantine/prism'
import { useMemo, useState } from 'react'
import { downloadAllFiles as downloadAllFonts, Stylesheet } from '../api'

const renderStylesheets = (styles: Stylesheet[], url: string, fontName: string) => {
  if (styles.length == 0) return ''

  if (styles.length == 1) {
    return styles[0].raw.replace(styles[0].url, url)
  } else {
    return styles.map(style =>
      style.raw.replace(style.url,
        url.replace(fontName, `${fontName}-${style.subset}`) // subset after font name
      )
    ).join('\n')
  }
}

export const Output = ({ styles, fontName }: { styles: Stylesheet[], fontName: string }) => {

  const [url, setUrl] = useState(`../${fontName}.woff2`)

  const downloadFonts = async () => {
    downloadAllFonts(fontName, styles)
  }
  return (
    <>
      <Title order={2} pb="sm">Output</Title>
      <List>
        {styles.map(style => (
          <List.Item key={style.subset}>
            {style.subset}: <Anchor sx={{overflowWrap: 'break-word'}} href={style.url}>{style.url}</Anchor>
          </List.Item>
        ))}
      </List>
      <Group py="md">
        <Button color="indigo" onClick={downloadFonts}>Download files</Button>
      </Group>
      <TextInput value={url} label="CSS import url" onChange={(e) => setUrl(e.target.value)} />
      <Prism language="css">
        {renderStylesheets(styles, url, fontName)}
      </Prism>
    </>
  )
}