import { Prism } from "@mantine/prism"

export default ({ children }: { children: string }) => (
  <Prism language="css">
    {children}
  </Prism>
)