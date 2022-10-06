import { Anchor, Container, Group, Text } from "@mantine/core"
import { IconBrandGithub } from '@tabler/icons'
export const Footer = () => (

  <Container py="md">
    <Anchor 
    href="https://github.com/aarol/variable-font-helper"
    sx={{justifyContent: 'end', display: 'flex', fontFamily: 'Inter, sans-serif'}}>
      <IconBrandGithub size={28} />
      Github
    </Anchor>
  </Container>
)