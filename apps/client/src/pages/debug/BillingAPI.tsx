import { gql, useQuery } from "@apollo/client";
import { Loading, useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { DataTable, Frame, Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";

const BillingAPI = () => {
  const [responseData, setResponseData] = useState("");
  const app = useAppBridge();
  const fetch = useFetch();
  const redirect = Redirect.create(app);

  async function fetchContent() {
    setResponseData("loading...");
    const res = await fetch("/apps/api/billing");
    const data = await res?.json();
    if (data.error) {
      setResponseData(data.error);
    } else if (data.confirmationUrl) {
      setResponseData("Redirecting");
      const { confirmationUrl } = data;
      redirect.dispatch(Redirect.Action.REMOTE, confirmationUrl);
    }
  }

  return (
    <Page
      title="Billing API"
      backAction={{ content: "Home", onAction: () => navigate("/debug") }}
    >
      <Layout>
        <Layout.Section>
          <LegacyCard
            sectioned
            primaryFooterAction={{
              content: "Subscribe merchant",
              onAction: () => {
                fetchContent();
              },
            }}
          >
            <p>
              Subscribe your merchant to a test $10.25 plan and redirect to your
              home page.
            </p>

            {responseData && <p>{responseData}</p>}
          </LegacyCard>
        </Layout.Section>
        <Layout.Section>
          <ActiveSubscriptions />
        </Layout.Section>
      </Layout>
    </Page>
  );
};

const ActiveSubscriptions = () => {
  const getActiveSubscriptions = gql`
    {
      appInstallation {
        activeSubscriptions {
          name
          status
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  __typename
                  price {
                    amount
                    currencyCode
                  }
                  interval
                }
              }
            }
          }
          test
        }
      }
    }
  `;

  const { loading, error, data } = useQuery(getActiveSubscriptions);

  let rows: any[] = [];
  if (loading) {
    console.log("loading", loading);
    return (
      <>
        <Frame>
          <Loading />
        </Frame>
      </>
    );
  }
  if (data) {
    const activeSubscriptions = data.appInstallation.activeSubscriptions;
    if (activeSubscriptions.length === 0) {
      rows.push(["No Plan", "N/A", "N/A", "USD 0.00"]);
    } else {
      console.log("Rendering Data", activeSubscriptions);
      activeSubscriptions.forEach((subscription: any) => {
        const price = subscription.lineItems[0].plan.pricingDetails.price;
        rows.push([
          subscription.name,
          subscription.status,
          subscription.test ? "True" : "False",
          price.currencyCode,
          price.amount,
        ]);
      });
    }
  }

  if (error) {
    rows.push(["Error", "Check console for more info"]);
    console.log("error", error.message);
  }

  return (
    <LegacyCard title="Active Subscriptions" sectioned>
      <DataTable
        columnContentTypes={["text", "text", "text", "text", "text"]}
        headings={["Plan Name", "Status", "Test", "Currency Code", "Amount"]}
        rows={rows}
      />
    </LegacyCard>
  );
};

export default BillingAPI;
