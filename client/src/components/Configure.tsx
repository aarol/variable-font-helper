import { Button, Checkbox, Chip, Container, type DefaultMantineColor, Divider, Group, RangeSlider, SegmentedControl, Slider, Space, Text, Title, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import type { Axis, } from "../api";
import { firstLetterUppercase } from "../util";
import type { AxisRegistry, FontFamily } from "../../../functions/src/metadata";

export type AxisState = {
  [tag: string]: {
    active: boolean,
    //               min     max
    value: number | [number, number],
    min: number, max: number,
    description: string,
  }
}

function initialAxisState(axes: AxisRegistry[]): AxisState {
  const res: AxisState = {}

  for (const axis of axes) {
    res[axis.tag] = {
      active: false,
      value: [axis.min, axis.max],
      min: axis.min,
      max: axis.max,
      description: axis.description,
    }
  }
  const { min, max } = res['wght']
  res['wght'] = {
    ...res['wght'],
    active: true,
    // some fonts have a higher min value than 300 or vice versa
    // clamp the weights so that they are within [min,max]
    //      300 or more         800 or less
    value: [Math.max(min, 300), Math.min(max, 800)],
  }

  return res
}

type ConfigureProps = {
  font: FontFamily,
  axes: AxisRegistry[],
  showGenerate: boolean,
  onGenerate: (fontFamily: string, axis: Axis[], subsets: string[], italic: boolean) => void,
  onChange: () => void,
}

export function Configure({ onChange, font, axes, showGenerate, onGenerate }: ConfigureProps) {

  const [state, setState] = useState<AxisState>(initialAxisState(axes))
  const [mode, setMode] = useState<"simple" | "advanced">('simple')

  const [subsets, setSubsets] = useState(["latin"])

  const [fineTune, setFineTune] = useState(false)

  const [italic, setItalic] = useState<boolean | undefined>()

  // biome-ignore lint/correctness/useExhaustiveDependencies: notifies parent of changed state
  useEffect(onChange, [state, subsets, italic])

  function onSubmit() {

    const axis = Object.entries(state)
      .filter(([_, s]) => s.active) // only active
      .map(([tag, v]) => ({ tag, weight: v.value })) // tag and weight

    onGenerate(font.family, axis, subsets, italic ?? false)
  }

  function handleSetMode(targetMode: "simple" | "advanced") {
    if (targetMode === "simple") {
      setState(initialAxisState(axes))
    }
    setMode(targetMode)
  }

  function setAxisValue(tag: string, s: Partial<AxisState[""]>) {
    setState({
      ...state, [tag]: {
        ...state[tag],
        ...s,
      }
    })
  }
  function setFixed(tag: string, fixed: boolean) {
    setAxisValue(tag, {
      "value": fixed ? state[tag].min : [state[tag].min, state[tag].max]
    })
  }

  function handleToggleAllSubsets(showAll: boolean) {
    if (showAll) {
      setSubsets(font.subsets)
    } else {
      setSubsets([])
    }
  }

  return (
    <>
      <Space h="md" />
      <Title order={2} pb="sm">Configure</Title>

      <Group>
        <SegmentedControl
          value={mode}
          onChange={m => handleSetMode(m as 'simple' | 'advanced')}
          data={[
            { label: 'Simple', value: 'simple' },
            { label: 'Advanced', value: 'advanced' }
          ]}
        />
        <Checkbox label="Fine tune" checked={fineTune} onChange={(e) => setFineTune(e.target.checked)} />

      </Group>
      {mode === 'simple' ? (
        <>
          <Container mb="md">
            <Group py="sm">
              <Text>Weight</Text>
            </Group>
            <RangeSlider
              min={state['wght'].min}
              minRange={1}
              max={state['wght'].max}
              step={calcSteps(fineTune, state['wght'].min, state['wght'].max)}
              value={state['wght'].value as [number, number]} // type is set in `handleSetMode` 
              onChange={(v) => setAxisValue('wght', {
                value: v
              })}
            />
          </Container>
          {state["slnt"] !== undefined && (
            <Container py="md">
              <Checkbox
                label="Italic (slnt)"
                checked={state["slnt"].active}
                onChange={(e) => setAxisValue("slnt", {
                  active: e.target.checked,
                })}
              />
            </Container>
          )}
          <Divider my="sm" />
        </>
      ) : (
        // advanced
        <>
          {
            Object.entries(state).map(([tag, state]) => (
              <Container key={tag} my={"sm"}>
                <Group mb="sm">
                  <Checkbox
                    checked={state.active ?? false}
                    onChange={(e) => setAxisValue(tag, { active: e.target.checked })}
                  />
                  <Text size="lg" title={state.description}>{tag}</Text>
                  {state.active && (
                    <Checkbox
                      checked={isFixed(state.value)}
                      onChange={(e) => setFixed(tag, e.target.checked)}
                      label="Fixed" />
                  )}
                </Group>
                {state?.active && (
                  <>
                    {isFixed(state.value) ? (
                      <Slider
                        min={state.min}
                        max={state.max}
                        step={calcSteps(fineTune, state.min, state.max)}
                        value={state.value}
                        onChange={(v) => setAxisValue(tag, { value: v })}
                      />
                    ) : (
                      <RangeSlider
                        min={state.min}
                        max={state.max}
                        minRange={1}
                        step={calcSteps(fineTune, state.min, state.max)}
                        value={state.value}
                        onChange={(v) => setAxisValue(tag, { value: v })}
                      />
                    )}
                  </>
                )}
                <Divider my="sm" />
              </Container>
            ))
          }
        </>
      )}

      {font.hasItalic && (
        <Container py="md">
          <Checkbox
            label="Italic"
            checked={italic ?? false}
            onChange={(e) => setItalic(e.target.checked)}
          />
        </Container>
      )}

      <Group justify="space-between">
        <Text>Character sets</Text>
        <Checkbox checked={font.subsets.length === subsets.length} id="cy-all-checkbox" label="All"
          onChange={e => handleToggleAllSubsets(e.currentTarget.checked)} />
      </Group>

      <Chip.Group multiple value={subsets} onChange={setSubsets}>
        <Group mt={5} mb="sm" gap="sm">
          {font.subsets.map(subset => (
            <Chip key={subset} value={subset}

            >{firstLetterUppercase(subset)}</Chip>
          ))}
        </Group>
      </Chip.Group>

      <Divider py="md" />
      {showGenerate ? (
        <Button
          disabled={subsets.length === 0}
          onClick={onSubmit} mb="md">Generate 🪄</Button>
      ) : undefined}
    </>
  )
}

function isFixed(value: number | [number, number]): value is number {
  return typeof (value) === 'number'
}

function calcSteps(fine: boolean, min: number, max: number) {
  if (fine) {
    return 1
  }
  const d = max - min
  if (d < 20) return 1
  if (d < 400) return 5
  return 50
}