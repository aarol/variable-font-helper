import { Accordion, Anchor } from "@mantine/core";

export const Accordions = () => (
  <Accordion>
    <Accordion.Item value="supported">
      <Accordion.Control>Can I use variable fonts?</Accordion.Control>
      <Accordion.Panel>
        Variable fonts are supported by <Anchor href="https://caniuse.com/?search=variable%20fonts">95% of browsers</Anchor> globally.
      </Accordion.Panel>
    </Accordion.Item>

    <Accordion.Item value="allowed">
      <Accordion.Control>Are you allowed to self host Google fonts?</Accordion.Control>
      <Accordion.Panel>
        
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)