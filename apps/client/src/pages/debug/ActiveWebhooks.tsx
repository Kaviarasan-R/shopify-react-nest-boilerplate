import { gql, useQuery } from "@apollo/client";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { DataTable, Frame, LegacyCard, Loading, Page } from "@shopify/polaris";
import { navigate } from "raviger";

const ActiveWebhooks = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const getInstalledWebhooks = gql`
    {
      webhookSubscriptions(first: 25) {
        edges {
          node {
            topic
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
              }
            }
          }
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getInstalledWebhooks);

  let rows = [];

  if (loading) {
    console.log("loading", loading);
  }

  if (data) {
    data.webhookSubscriptions.edges.forEach(
      (e: { node: { topic: any; endpoint: { callbackUrl: any } } }) => {
        const topic = e.node.topic;
        const callbackUrl = e.node.endpoint.callbackUrl;
        rows.push([topic, callbackUrl]);
      }
    );
  }

  if (error) {
    rows.push(["Error", "Check console for more info"]);
    console.log("error", error.message);
  }

  const { data: myShopifyDomain } = useQuery(gql`
    {
      shop {
        myshopifyDomain
      }
    }
  `);

  return (
    <Page
      title="Webhooks"
      backAction={{ content: "Home", onAction: () => navigate("/debug") }}
    >
      {loading && (
        <Frame>
          <Loading />
        </Frame>
      )}
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "text"]}
          headings={["Topic", "Callback Url"]}
          rows={rows}
        />
      </LegacyCard>
      <LegacyCard
        title="Webhook URLs"
        sectioned
        primaryFooterAction={
          myShopifyDomain
            ? {
                content: "Reauth",
                onAction: () => {
                  redirect.dispatch(
                    Redirect.Action.REMOTE,
                    `https://${process.env.SHOPIFY_APP_ORIGIN}/auth?shop=${myShopifyDomain.shop.myshopifyDomain}`
                  );
                },
              }
            : { content: "Fetching data", disabled: true }
        }
      >
        <p>
          Webhooks are registered when the app is installed, or when tokens are
          refetched by going through the authentication process. If your
          Callback URL isn't the same as your current URL (happens usually
          during dev when using ngrok), you need to go through the auth process
          again. Click on `reauth` to fix this.
        </p>
      </LegacyCard>
    </Page>
  );
};

export default ActiveWebhooks;
