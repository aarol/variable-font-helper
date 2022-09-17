import { Alert, Anchor, AppShell, Autocomplete, AutocompleteItem, Button, Checkbox, Chip, Container, Divider, Group, MantineProvider, RangeSlider, SegmentedControl, Slider, Space, Text, Title } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { useEffect, useMemo, useState } from "react";
import { FontFamily, getStylesheets, getVariableFontData, Stylesheet } from "./api";
import { Accordions } from "./components/accordions";
import { Output } from "./components/Output";

const firstLetterUppercase = (s: string) =>
  s[0].toUpperCase() + s.slice(1)

function App() {

  const [titleSize, setTitleSize] = useState(700)

  const [alert, setAlert] = useState('')

  const [availableFonts, setAvailableFonts] = useState([] as FontFamily[])

  const [font, setFont] = useState<FontFamily | undefined>()

  const [stylesheets, setStylesheets] = useState<Stylesheet[]>([])

  const [subsets, setSubsets] = useState(["latin"])

  const [axesMode, setAxesMode] = useState('simple')
  // How big the step is on weight
  const [fineStep, setFineStep] = useState(false)

  useEffect(() => {
    getVariableFontData()
      .then((metadata) => {
        setAvailableFonts(metadata.familyMetadataList)
      }).catch(err => {
        console.log(err)
        setAlert(err.toString())
      })
  }, [])

  const onSelectFont = (item: AutocompleteItem) => {
    setFont(availableFonts.find(a => a.family === item.value))
    setStylesheets([])
  }

  const onGenerate = () => {
    getStylesheets(font!.family, subsets, [{ weight: [400, 800], tag: 'wght' }])
      .then(setStylesheets)
      .catch(err => {
        console.log(err);
        setAlert(err.toString())
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
          <Title align="center" sx={{ fontWeight: titleSize }}>
            Variable font helper
          </Title>
          <Slider
            size="sm"
            sx={{ maxWidth: 200, marginInline: 'auto' }}
            label={null}
            value={titleSize}
            min={100}
            max={900}
            onChange={setTitleSize}
          />
          {alert !== '' && (
            <Alert title="Error getting data from Google Fonts" my="md">{alert}</Alert>
          )}

          <Autocomplete
            data={availableFonts.map(f => ({ value: f.family }))}
            label="Choose your variable font"
            placeholder="Roboto Flex"
            onItemSubmit={onSelectFont}
          />
          <Space h="md" />
          {font != undefined ? (
            <>
              <Text size="xl">{font.family}</Text>
              <Text>By {font.designers.join(", ")}</Text>
              (<Anchor href={`https://fonts.google.com/specimen/${firstLetterUppercase(font.family)}/tester`}>Type tester</Anchor>)
              <Space h="md" />
              <Title order={2}>Axes</Title>
              <SegmentedControl
                value={axesMode}
                onChange={setAxesMode}
                data={[
                  { label: 'Simple', value: 'simple' },
                  { label: 'Advanced', value: 'all' }
                ]}
              />

              {/* {axesMode == 'all' ? font.axes.map(axis => (
                <Container key={axis.tag} py={"sm"}>
                  <Text size="lg">{axis.tag}</Text>
                  <RangeSlider
                    min={axis.min}
                    max={axis.max}
                    minRange={1}
                    defaultValue={[axis.min, axis.max]}
                  // marks={[{ value: axis.min, label: axis.min }, { value: axis.max, label: axis.max }]}
                  />
                </Container>
              )) : ( */}
              <>
                <Container py="sm">
                  <Group py="sm">
                    <Text>Weight</Text>
                    <Checkbox label="Fine tune" checked={fineStep} onChange={(e) => setFineStep(e.target.checked)} />
                  </Group>
                  <RangeSlider
                    min={100}
                    minRange={0}
                    max={1000}
                    step={fineStep ? 1 : 50}
                    defaultValue={[400, 800]}
                    marks={[{ value: 0, label: 0 }, { value: 1000, label: 1000 }]}
                  />
                </Container>
                <Container py="md">
                  <Checkbox
                    label="Italic"
                  />
                </Container>
              </>

              <Text>Character sets</Text>

              <Chip.Group multiple value={subsets} onChange={setSubsets} py="md">
                {font.subsets.map(subset => (
                  <Chip key={subset} value={subset}>{firstLetterUppercase(subset)}</Chip>
                ))}
              </Chip.Group>

              <Divider py="md" />
              <Button color={stylesheets.length === 0 ? 'indigo' : 'gray'}
                onClick={onGenerate} mb="md">Generate output</Button>
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
