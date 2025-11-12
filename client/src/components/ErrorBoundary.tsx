import React from "react";
import { Container, Title, Text, Button, Stack, Alert } from "@mantine/core";
import { IconAlertTriangle, IconBrandGithub } from "@tabler/icons-react";

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {

  state = {
    error: "",
  };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError(error: any) {
    console.log("there");
    return { error: error.message };
  }

  render() {
    if (this.state.error) {
      return (
        <Container size="sm" pt="xl">
          <Stack gap="md" align="center">
            <Alert
              icon={<IconAlertTriangle size="1rem" />}
              title="Something went wrong"
              color="red"
              variant="light"
            >
              <Text size="sm" mb="md">
                An unexpected error occurred while rendering this component:
              </Text>
              <Text size="xs" c="dimmed" ff="monospace">
                {this.state.error}
              </Text>
            </Alert>

            <Stack gap="xs" align="center">
              <Text size="sm" ta="center" c="dimmed">
                If this issue persists, please file a GitHub issue.
              </Text>
              <Button
                component="a"
                href="https://github.com/aarol/variable-font-helper/issues"
                target="_blank"
                rel="noopener noreferrer"
                leftSection={<IconBrandGithub size="1rem" />}
                variant="light"
              >
                Report Issue on GitHub
              </Button>
            </Stack>
          </Stack>
        </Container>
      )
    }

    return this.props.children;
  }
}
