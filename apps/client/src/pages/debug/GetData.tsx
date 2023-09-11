import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

import { useStore } from "@/stores";

const GetData = () => {
  const [responseData, setResponseData] = useState("");
  const [responseDataPost, setResponseDataPost] = useState("");
  const [responseDataGQL, setResponseDataGQL] = useState("");
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const fetch = useFetch();

  const shop = useStore((state) => state.shop);

  function redirectToExitframe(res: Response | null) {
    if (res?.status === 400) {
      const authUrlHeader = res.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );
      redirect.dispatch(
        Redirect.Action.APP,
        authUrlHeader || `/exitframe?shop=${shop}&host={host}`
      );
    }
  }

  async function fetchContent() {
    setResponseData("loading...");

    const res = await fetch("/apps/api");
    const { text } = await res?.json();
    redirectToExitframe(res);
    setResponseData(text);
  }
  async function fetchContentPost() {
    setResponseDataPost("loading...");
    const postBody = JSON.stringify({ content: "Body of POST request" });
    const res = await fetch("/apps/api", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: postBody,
    });
    const { content } = await res?.json();
    redirectToExitframe(res);
    setResponseDataPost(content);
  }

  async function fetchContentGQL() {
    setResponseDataGQL("loading...");
    const res = await fetch("/apps/api/gql");
    const response = await res?.json();
    redirectToExitframe(res);
    setResponseDataGQL(response.body.data.shop.name);
  }

  useEffect(() => {
    fetchContent();
    fetchContentPost();
    fetchContentGQL();
  }, []);

  return (
    <Page
      title="Data Fetching"
      backAction={{ content: "Home", onAction: () => navigate("/debug") }}
    >
      <Layout>
        <Layout.Section>
          <LegacyCard
            sectioned
            primaryFooterAction={{
              content: "Refetch",
              onAction: () => {
                fetchContent();
              },
            }}
          >
            <p>
              GET <code>"/apps/api"</code>: {responseData}
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard
            sectioned
            primaryFooterAction={{
              content: "Refetch",
              onAction: () => {
                fetchContentPost();
              },
            }}
          >
            <p>
              POST <code>"/apps/api" </code>: {responseDataPost}
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <LegacyCard
            sectioned
            primaryFooterAction={{
              content: "Refetch",
              onAction: () => {
                fetchContentGQL();
              },
            }}
          >
            <p>
              GET <code>"/apps/api/gql"</code>: {responseDataGQL}
            </p>
          </LegacyCard>
          <LegacyCard title="Developer Notes">
            <LegacyCard.Section title="Making Requests">
              <li>
                Create a new module in <code>server</code> and add it to your{" "}
                <code>AppModule</code> to expose it behind{" "}
                <code>VerifyRequest</code>.
              </li>
              <li>
                Create a new instance of <code>useFetch()</code> and use that to
                make a request to <code>/your-route/goes-here/</code>
              </li>
            </LegacyCard.Section>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default GetData;
