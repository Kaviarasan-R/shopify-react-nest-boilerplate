import useFetch from "@/hooks/useFetch";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { Layout, LegacyCard, Page } from "@shopify/polaris";
import { navigate } from "raviger";
import { useEffect } from "react";

const HomePage = () => {
  const app = useAppBridge();
  const redirect = Redirect.create(app);
  const fetch = useFetch();

  const PRODUCTS_QUERY = `query {
    products(first: 10) {
      edges {
        node {
          id
          title
          images(first: 1) {
            edges {
              node {
                id
                originalSrc
              }
            }
          }
        }
      }
    }
  }`;

  async function fetchProducts() {
    const response = await fetch("/graphql", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ query: PRODUCTS_QUERY }),
    });
    console.log(await response?.json());
  }
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Page title="Home">
      <Layout>
        <Layout.Section fullWidth>
          <LegacyCard
            title="Debug Cards"
            sectioned
            primaryFooterAction={{
              content: "Debug Cards",
              onAction: () => {
                navigate("/debug");
              },
            }}
          >
            <p>
              Explore how the repository handles data fetching from the backend,
              App Proxy, making GraphQL requests, Billing API and more.
            </p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            sectioned
            title="Repository"
            primaryFooterAction={{
              content: "GitHub",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://github.com/Kaviarasan-R/shopify-react-nest-boilerplate",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Open Issue",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://github.com/Kaviarasan-R/shopify-react-nest-boilerplate/issues",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>Star the repository, open a new issue or start a discussion.</p>
          </LegacyCard>
          <LegacyCard
            sectioned
            title="Changelog"
            primaryFooterAction={{
              content: "Explore",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/changelog/",
                  newContext: true,
                });
              },
            }}
          >
            <p>Explore changelog on Shopify.dev and follow updates.</p>
          </LegacyCard>
        </Layout.Section>
        <Layout.Section oneHalf>
          <LegacyCard
            sectioned
            title="Documentation"
            primaryFooterAction={{
              content: "Explore APIs",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://shopify.dev/graphiql/admin-graphiql",
                  newContext: true,
                });
              },
            }}
            secondaryFooterActions={[
              {
                content: "Design Guidelines",
                onAction: () => {
                  redirect.dispatch(Redirect.Action.REMOTE, {
                    url: "https://shopify.dev/apps/design-guidelines",
                    newContext: true,
                  });
                },
              },
            ]}
          >
            <p>
              Explore the GraphQL APIs in Graphiql or read design guidelines.
            </p>
          </LegacyCard>
          <LegacyCard
            sectioned
            title="Contact"
            primaryFooterAction={{
              content: "LinkedIn",
              onAction: () => {
                redirect.dispatch(Redirect.Action.REMOTE, {
                  url: "https://www.linkedin.com/in/kaviarasan-r",
                  newContext: true,
                });
              },
            }}
          >
            <p>Feel free to contact me on LinkedIn.</p>
          </LegacyCard>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default HomePage;
