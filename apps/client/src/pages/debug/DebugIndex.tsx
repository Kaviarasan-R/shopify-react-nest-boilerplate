import {
  Layout,
  Card,
  Page,
  Button,
  Text,
  VerticalStack,
  HorizontalStack,
} from "@shopify/polaris";
import { navigate } from "raviger";

const DebugIndex = () => {
  return (
    <Page
      title="Debug Cards"
      subtitle="Interact and explore the current installation"
      backAction={{ content: "Home", onAction: () => navigate("/") }}
    >
      <Layout>
        <Layout.Section oneHalf>
          <Card>
            <VerticalStack gap={"3"}>
              <Text variant="headingSm" as="h6">
                Webhooks
              </Text>
              <p>Explore registered webhooks and endpoints.</p>
              <HorizontalStack align="end">
                <Button
                  onClick={() => {
                    navigate("/debug/activeWebhooks");
                  }}
                  primary
                >
                  Explore
                </Button>
              </HorizontalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <VerticalStack gap={"3"}>
              <Text variant="headingSm" as="h6">
                Data Fetching
              </Text>
              <p>
                Run GET and POST requests to your server along with GraphQL
                queries.
              </p>
              <HorizontalStack align="end">
                <Button
                  onClick={() => {
                    navigate("/debug/getData");
                  }}
                  primary
                >
                  Explore
                </Button>
              </HorizontalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <VerticalStack gap={"3"}>
              <Text variant="headingSm" as="h6">
                Billing API
              </Text>
              <p>Subscribe merchant to a plan and explore existing plans.</p>
              <HorizontalStack align="end">
                <Button
                  onClick={() => {
                    navigate("/debug/billing");
                  }}
                  primary
                >
                  Subscribe
                </Button>
              </HorizontalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <Card>
            <VerticalStack gap={"3"}>
              <Text variant="headingSm" as="h6">
                Dev Notes
              </Text>
              <p>Notes for devs on expectations.</p>
              <HorizontalStack align="end">
                <Button
                  onClick={() => {
                    navigate("/debug/devNotes");
                  }}
                  primary
                >
                  Let's go
                </Button>
              </HorizontalStack>
            </VerticalStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default DebugIndex;
