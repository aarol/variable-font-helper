import { Alert, Anchor, AppShell, Autocomplete, AutocompleteItem, Button, Checkbox, Chip, Container, Divider, Group, MantineProvider, RangeSlider, SegmentedControl, Slider, Space, Text, Title } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { Axis, AxisRegistry, FontFamily, getStylesheets, getVariableFontData, Stylesheet, VariableFontData } from "./api";
import { Accordions } from "./components/Accordions";
import { Configure } from "./components/Configure";
import { FontTitle } from "./components/FontTitle";
import { Instructions } from "./components/Instructions";
import { Output } from "./components/Output";
import { firstLetterUppercase } from "./util";


function App() {

  const [alert, setAlert] = useState<{ title: string, content: string } | null>(null)

  const [fontData, setFontData] = useState<VariableFontData | null>(null)

  const [font, setFont] = useState<FontFamily | undefined>()

  const [stylesheets, setStylesheets] = useState<Stylesheet[]>([])

  const fontAxes: AxisRegistry[] = useMemo(() => {
    return font?.axes.map((axis) => {
      const reg = fontData?.axisRegistry.find((r) => r.tag === axis.tag)
      return ({
        ...axis,
        precision: reg!.precision,
        description: reg!.description
      });
    }) ?? []
  }, [fontData, font])

  useEffect(() => {
    if (!CSS.supports("font-variation-settings", `"wght" 123`)) {
      setAlert({
        title: "Variable fonts not supported",
        content: "Variable fonts don't seem to be supported in this browser. " +
          "Make sure variable fonts are supported by your browser and operating system."
      })
    }

    getVariableFontData()
      .then((metadata) => {
        setFontData(metadata)
      }).catch((err: Object) => {
        console.log(err)
        setAlert({
          title: "Failed to get font data",
          content: err.toString()
        })
      })
  }, [])

  const onSelectFont = (item: AutocompleteItem) => {
    setFont(fontData?.familyMetadataList.find(a => a.family === item.value))

    setStylesheets([])
  }

  const onConfigChange = () => {
    setStylesheets([])
  }

  const onGenerate = (axes: Axis[], subsets: string[]) => {

    setStylesheets([])
    setAlert(null)

    if (subsets.length === 0) {
      setAlert({
        title: "Error generating output",
        content: "No character sets selected"
      })
      return
    }
    getStylesheets(font!.family, subsets, axes)
      .then(setStylesheets)
      .catch((err: Object) => {
        console.log(err);
        setAlert({
          title: "Error getting data from Google Fonts",
          content: err.toString(),
        })
      })
  }

  const colorScheme = useColorScheme()

  return (
    <MantineProvider theme={{
      colorScheme,
      headings: {
        fontFamily: 'Inter, sans-serif'
      },
    }} withNormalizeCSS withGlobalStyles>
      <AppShell padding={"xl"}>
        <Container size="sm">
          <FontTitle />
          <Text align="center" pb="md">Self host variable fonts from Google Fonts</Text>

          <Autocomplete
            data={fontData?.familyMetadataList.map(f => ({ value: f.family })) ?? []}
            label="Choose your variable font"
            placeholder="Roboto Flex"
            onItemSubmit={onSelectFont}
          />

          <Space h="md" />

          {alert !== null && (
            <Alert title={alert.title} my="md" color="red">
              {alert.content}
            </Alert>
          )}

          {font != undefined ? (
            <>
              <Text size="xl">{font.family}</Text>
              <Text>By {font.designers.join(", ")}</Text>

              <Anchor target="_blank" href={`https://fonts.google.com/specimen/${firstLetterUppercase(font.family)}/tester`}>
                <Text size="lg">
                  Type tester
                </Text>
              </Anchor>

              <Instructions />

              <Configure
                key={font.family}
                axes={fontAxes}
                font={font}
                submitColor={stylesheets.length !== 0 ? 'gray' : 'indigo'}
                onGenerate={onGenerate}
                onChange={onConfigChange} />

              {stylesheets.length > 0 && (
                <Output styles={stylesheets}
                  fontName={font.family.replaceAll(' ', '_')}
                />
              )
              }
            </>
          ) : <Accordions />
          }
        </Container>
      </AppShell>
    </MantineProvider>
  )
}

export default App
