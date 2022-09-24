import { Button, Checkbox, Chip, Container, Divider, Group, RangeSlider, SegmentedControl, Slider, Space, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Axis, AxisRegistry, FontFamily } from "../api";
import { firstLetterUppercase } from "../util";

export type AxisState = {
  [tag: string]: {
    active: boolean,
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

  res['wght'] = {
    ...res['wght'],
    active: true,
    value: [300, 800],
  }

  return res
}

type ConfigureProps = {
  font: FontFamily,
  axes: AxisRegistry[],
  submitColor: 'indigo' | 'gray',
  onGenerate: (axis: Axis[], subsets: string[]) => void,
  onChange: () => void,
}

export function Configure({ onChange, font, axes, submitColor, onGenerate }: ConfigureProps) {

  const [state, setState] = useState<AxisState>(initialAxisState(axes))
  const [mode, setMode] = useState<"simple" | "advanced">('simple')

  const [subsets, setSubsets] = useState(["latin"])

  const [fineTune, setFineTune] = useState(false)

  useEffect(onChange, [state,subsets])

  function onSubmit() {

    const axis = Object.entries(state)
      .filter(([_, s]) => s.active) // only active
      .map(([tag, v]) => ({ tag, weight: v.value })) // tag and weight
    console.log(axis);

    onGenerate(axis, subsets)
  }

  function handleSetMode(mode: "simple" | "advanced") {
    if (mode === "simple") {
      state["wght"] = {
        ...state["wght"],
        active: true,
        value: [300, 800],
      }
    }
    setMode(mode)
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

  return (
    <>
      <Space h="md" />
      <Title order={2}>Axes</Title>

      <Group>
        <SegmentedControl
          value={mode}
          onChange={handleSetMode}
          data={[
            { label: 'Simple', value: 'simple' },
            { label: 'Advanced', value: 'all' }
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
              min={100}
              minRange={0}
              max={1000}
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
                label="Slant (Italic)"
                checked={state["slnt"].active}
                onChange={(e) => setAxisValue("slnt", {
                  active: e.target.checked,
                })}
              />
            </Container>
          )}
        </>
      ) : (
        <>
          {
            Object.entries(state).map(([tag, state]) => (
              <Container key={tag} py={"sm"}>
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
                <Divider mt="" />
              </Container>
            ))
          }
        </>
      )}
      <Text>Character sets (default: Latin)</Text>

      <Chip.Group multiple value={subsets} onChange={setSubsets} py="md">
        {font.subsets.map(subset => (
          <Chip key={subset} value={subset}>{firstLetterUppercase(subset)}</Chip>
        ))}
      </Chip.Group>

      <Divider py="md" />
      <Button color={submitColor}
        onClick={onSubmit} mb="md">Generate output</Button>
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
  let d = Math.abs(max - min)
  if (d < 20) return 1
  if (d < 400) return 5
  return 50
}