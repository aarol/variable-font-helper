import { Accordion, Code, Container, List, Text } from "@mantine/core";

export const Instructions = () => (
  <Accordion py="sm">
    <Accordion.Item value="instructions">
      <Accordion.Control>Instructions</Accordion.Control>
      <Accordion.Panel>
        <List type="ordered">
          <List.Item py="sm">Customize the fonts.
            In simple mode, select the font weight range and whether you want slant/italic.
            In advanced mode, select the axes that you want to customize.
            Fixed values will only have the selected axis value.
          </List.Item>
          <List.Item>
            Choose the character sets. Select all charsets if you need to support non-latin languages. Different fonts support different character sets.
          </List.Item>
          <List.Item py="sm">
            When you press <Code>Generate output</Code>, it should make the request to fonts.googleapis.com
            and show you the output CSS. Copy the output and paste it into your website's CSS.
          </List.Item>
          <List.Item>
            Clicking <Code>Download All</Code> will download all of the selected subsets and create a zip archive of them (in your browser).
          </List.Item>
          <List.Item py="sm">
            Download the fonts and move them into your website's static or public directory so that they're accessible with relative imports.
            <Text weight={600}>
              Test this by opening the expected url in your browser.
            </Text>
          </List.Item>
          <List.Item>
            You're done! Remember to set appropriate <Code>Cache-Control</Code> headers for the font files.
          </List.Item>
        </List>
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion>
)