import './App.css'
import { CssVarsProvider } from '@mui/joy'
import { Sheet } from '@mui/joy'
import { useState } from 'react'
import { Form } from './Form'
import { Typography } from '@mui/joy'
import { extractSelectedCharsets, getCharsets } from './api'
import { CharsetChips } from './Chips'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { Button } from '@mui/joy'
import { Box } from '@mui/joy'

const inter = `
/* cyrillic-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa0ZL7SUc.woff2) format('woff2');
  unicode-range: U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
/* greek-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2ZL7SUc.woff2) format('woff2');
  unicode-range: U+1F00-1FFF;
}
/* greek */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1pL7SUc.woff2) format('woff2');
  unicode-range: U+0370-03FF;
}
/* vietnamese */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7SUc.woff2) format('woff2');
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
/* latin-ext */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2) format('woff2');
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
/* latin */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 300 800;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/inter/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
`

function App() {

  const [fontData, setFontData] = useState("")
  const [charsets, setCharsets] = useState([])
  const [selectedCharsets, setSelectedCharsets] = useState([])

  const outputCharsets = useMemo(() => extractSelectedCharsets(selectedCharsets, fontData),
    [selectedCharsets, fontData],
  )

  const onData = (data) => {
    setFontData(data)

    const chars = getCharsets(data)
    setCharsets(chars)
    setSelectedCharsets(["latin"])
  }

  // useEffect(() => { onData(inter) }, [])

  if (fontData) {
    return (
      <CssVarsProvider>
        <Sheet
          sx={{
            maxWidth: 600,
            mx: 'auto',
            my: 4,
            py: 3,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 'sm',
            boxShadow: 'md',
          }}
          variant='outlined'>
          <div>
            <Typography level='h4' component="h1">
              <b>Variable font picker</b>
            </Typography>
          </div>
          <CharsetChips
            charsets={charsets}
            selected={selectedCharsets}
            onSelect={s => setSelectedCharsets(v => [...v, s])}
            onUnselect={s => setSelectedCharsets(v => v.filter(e => e !== s))}
          />
          {!!outputCharsets && (
            <>
              <Typography level='h4'
                endDecorator={
                  <Button sx={{ ml: 'auto' }} color='neutral'
                  onClick={() => navigator.clipboard.writeText(outputCharsets)}
                  >Copy to clipboard
                  </Button>}
              >Selected charsets
              </Typography>
              <pre style={{ textAlign: 'left', overflowX: 'scroll' }}>
                {outputCharsets}
              </pre>
            </>
          )}
        </Sheet>
      </CssVarsProvider>
    )
  } else {
    return (
      <CssVarsProvider>
        <Form onData={onData} />
      </CssVarsProvider>
    )
  }
}

export default App
