import { Alert, Anchor, AppShell, Autocomplete, Button, Collapse, Container, MantineProvider, Space, Text } from "@mantine/core";
import '@mantine/core/styles.css';
import { Footer } from "./components/Footer";
import { IconExternalLink } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { type Axis, getStylesheets, getVariableFontData, type Stylesheet } from "./api";

import { Accordions } from "./components/Accordions";
import { Configure } from "./components/Configure";
import { FontTitle } from "./components/FontTitle";
import { Instructions } from "./components/Instructions";
import { Output } from "./components/Output";
import { firstLetterUppercase } from "./util";
import type { AxisRegistry, FontFamily, Metadata } from "../../functions/src/metadata";

type AlertMessage = {
  title: string,
  content: string,
}

// used to format designers list
const listFormatter = new Intl.ListFormat("en")

function App() {

  const [alert, setAlert] = useState<AlertMessage | null>(null)

  // Data from API
  const [fontData, setFontData] = useState<Metadata | null>(null)

  // Currently selected font
  const [font, setFont] = useState<FontFamily | undefined>()

  // Output CSS
  const [stylesheets, setStylesheets] = useState<Stylesheet[]>([])

  const fontAxes: AxisRegistry[] = useMemo(() => {
    return font?.axes.map((axis) => {
      const reg = fontData?.axisRegistry.find((r) => r.tag === axis.tag)
      if (reg) {
        return ({
          ...axis,
          displayName: reg.displayName,
          precision: reg.precision,
          description: reg.description
        });
      }
    }).filter((axis): axis is AxisRegistry => axis !== undefined) ?? []
  }, [fontData, font])

  useEffect(() => {
    if (!CSS.supports("font-variation-settings", `"wght" 123`)) {
      setAlert({
        title: "Variable fonts not supported",
        content: "Variable fonts don't seem to be supported by your browser. " +
          "Make sure variable fonts are supported by your browser and operating system."
      })
    }

    getVariableFontData()
      .then(setFontData)
      .catch((err) => {
        console.log(err)
        setAlert({
          title: "Failed to get font data",
          content: err.toString()
        })
      })
  }, [])

  const onSelectFont = (item: string) => {
    setFont(fontData?.familyMetadataList.find(a => a.family === item))

    resetOutput()
  }

  const resetOutput = () => {
    setStylesheets([])
  }

  const onGenerate = (fontFamily: string, axes: Axis[], subsets: string[], italic: boolean) => {
    resetOutput()

    setAlert(null)

    if (subsets.length === 0) {
      setAlert({
        title: "Error generating output",
        content: "No character sets selected"
      })
      return
    }
    getStylesheets(fontFamily, subsets, axes, italic)
      .then(setStylesheets)
      .catch((err) => {
        console.log(err);
        setAlert({
          title: "Error getting font styles from Google Fonts",
          content: err.toString(),
        })
      })
  }

  return (
    <MantineProvider theme={{
      headings: {
        fontFamily: 'Inter, sans-serif'
      },
      primaryColor: 'indigo'
    }} defaultColorScheme="auto">
      <AppShell padding={"xl"}>
        <Container size="sm">
          <FontTitle />
          <Text ta="center" pb="md">Self host variable fonts from
            <Anchor href="https://fonts.google.com/?vfonly=true" target="_blank"> Google Fonts</Anchor>
          </Text>

          <Autocomplete
            data={fontData?.familyMetadataList.map(f => f.family) ?? []}
            label="Select your variable font"
            size="md"
            placeholder="Roboto Flex"
            onChange={onSelectFont}
          />

          <Space h="md" />

          {alert !== null && (
            <Alert title={alert.title} my="md" color="red">
              {alert.content}
              <Text size="sm" pt="md">
                <span>If this issue persists, please file an issue on </span>
                <Anchor href="https://github.com/aarol/variable-font-helper/issues/new">Github</Anchor>
              </Text>
            </Alert>
          )}

          {font !== undefined ? (
            <>
              <Text size="xl">{font.family}</Text>
              <Text>By {listFormatter.format(font.designers)}</Text>

              <Button component="a" target="_blank" href={`https://fonts.google.com/specimen/${firstLetterUppercase(font.family)}/tester`} my="sm" variant="outline" leftSection={<IconExternalLink size={14} />}>
                Type tester
              </Button>

              <Instructions />

              <Configure
                key={font.family} // to refresh config on font family change
                axes={fontAxes}
                font={font}
                submitColor={stylesheets.length !== 0 ? 'gray' : undefined}
                onGenerate={onGenerate}
                onChange={resetOutput} />

              <Collapse in={stylesheets.length > 0}>
                <Output styles={stylesheets}
                  fontName={font.family.replaceAll(' ', '_')}
                />
              </Collapse>
            </>
          ) : <Accordions />
          }
          <Footer />
        </Container>
      </AppShell>
    </MantineProvider>
  )
}

export default App
