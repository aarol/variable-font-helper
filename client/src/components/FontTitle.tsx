import { Slider, Title } from "@mantine/core"
import { useState } from "react"

export function FontTitle() {
  const [titleSize, setTitleSize] = useState(700)

  return (
    <>
      <Title align="center" pb="sm" order={2} sx={{ fontWeight: titleSize}}>
        Variable font helper
      </Title>
      <Slider
        size="sm"
        pb="lg"
        sx={{ maxWidth: 200, marginInline: 'auto' }}
        label={null}
        value={titleSize}
        min={100}
        max={900}
        onChange={setTitleSize} />
    </>
  )
}