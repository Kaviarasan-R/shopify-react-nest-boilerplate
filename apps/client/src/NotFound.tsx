import { Card, EmptyState, Layout, Page } from "@shopify/polaris";

const NotFound = () => {
  return (
    <Page>
      <Layout>
        <Layout.Section fullWidth>
          <Card>
            <EmptyState
              heading="Page Not Found"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>
                Oops! The page you are looking for might have been removed, had
                its name changed, or is temporarily unavailable.
              </p>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default NotFound;
