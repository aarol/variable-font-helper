import { Anchor, Container } from "@mantine/core"
import { IconBrandGithub } from '@tabler/icons-react'
export const Footer = () => (

  <Container py="md">
    <Anchor 
    href="https://github.com/aarol/variable-font-helper"
    styles={{root: {justifyContent: 'end', display: 'flex', fontFamily: 'Inter, sans-serif'}}}>
      <IconBrandGithub size={28} />
      Github
    </Anchor>
  </Container>
)