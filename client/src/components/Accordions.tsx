import { Accordion, Anchor, Code, List, Text } from "@mantine/core";
import image from '../googlefonts.png'

export const Accordions = () => (
  <Accordion>
    <Accordion.Item value="what">
      <Accordion.Control>What are variable fonts?</Accordion.Control>
      <Accordion.Panel>
        <Text>
          <Anchor href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Fonts/Variable_Fonts_Guide">Variable fonts on MDN</Anchor>
        </Text>
        <Text>
          <Anchor href="https://web.dev/variable-fonts/">Variable fonts on web.dev</Anchor>
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="supported">
      <Accordion.Control>Can I use variable fonts?</Accordion.Control>
      <Accordion.Panel>
        Variable fonts are supported by <Anchor href="https://caniuse.com/?search=variable%20fonts">95% of browsers</Anchor> globally.
        <Text>
          For older browsers, set fallback fonts and use CSS feature queries or standard weights (400, 500, 800 etc.)
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="allowed">
      <Accordion.Control>Are you allowed to self host Google fonts?</Accordion.Control>
      <Accordion.Panel>
        <Text>
          Most fonts are licensed under the <Anchor href="https://scripts.sil.org/cms/scripts/page.php?site_id=nrsi&id=OFL">Open Font License</Anchor> and can be used free of charge.
        </Text>
        <Text py="sm">
          <Anchor href="https://developers.google.com/fonts/faq">https://developers.google.com/fonts/faq</Anchor>
        </Text>
        <Text>
          <Anchor href="https://fonts.google.com/knowledge/using_type/self_hosting_web_fonts">https://fonts.google.com/knowledge/using_type/self_hosting_web_fonts</Anchor>
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="how">
      <Accordion.Control>Can I get the fonts without using this app?</Accordion.Control>
      <Accordion.Panel>
        <Text>
          Sure! Go to <Anchor href="https://fonts.google.com/">Google Fonts</Anchor> and select a font with some weights.
          You should see something like this:
        </Text>
        <img src={image} alt="screenshot from Google Fonts, with link href https://fonts.googleapis.com/css2?family=Inter:wght@500;600&amp;display=swap" />
        <Text>
          Paste the last url into a new tab and replace the ";" between the weights with ".."
          It should look something like this: <Code>https://fonts.googleapis.com/css2?family=Inter:wght@500..600&display=swap</Code>
        </Text>
        <Text py="sm">
          Now copy the font-faces and download the fonts for every subset you need.
        </Text>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)