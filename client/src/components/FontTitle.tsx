import { Slider, Title } from "@mantine/core"
import { useState } from "react"

export function FontTitle() {
  const [titleSize, setTitleSize] = useState(700)

  return (
    <>
      <Title ta="center" py="sm" order={2} styles={{ root: { fontWeight: titleSize } }}>
        Variable font helper
      </Title>
      <Slider
        size="sm"
        pb="lg"
        styles={{ root: { maxWidth: 200, margin: '0 auto' } }}
        label={null}
        value={titleSize}
        min={100}
        max={900}
        onChange={setTitleSize} />
    </>
  )
}