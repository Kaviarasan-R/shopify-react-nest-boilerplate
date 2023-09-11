import { useMemo, useState, useEffect } from "react";
import { useNavigate, usePath, useQueryParams } from "raviger";
import { LocationOrHref, Provider } from "@shopify/app-bridge-react";
import { Layout, Page, Spinner } from "@shopify/polaris";
import { AppBridgeProviderProps } from "@/types";
import { useStore } from "@/stores";

export function AppBridgeProvider({ children }: AppBridgeProviderProps) {
  const navigate = useNavigate();
  const location = usePath();
  const [query] = useQueryParams();

  const changeEmbedded = useStore((state: any) => state.changeEmbedded);
  const changeShop = useStore((state: any) => state.changeShop);
  const changeHost = useStore((state: any) => state.changeHost);

  const [appBridgeConfig, setAppBridgeConfig] = useState<any>(null);

  useEffect(() => {
    const host = query?.host;
    changeEmbedded(query.embedded);
    changeShop(query.shop);
    changeHost(query.host);

    if (host) {
      setAppBridgeConfig({
        host: host,
        apiKey: process.env.SHOPIFY_API_KEY,
        forceRedirect: true,
      });
    }
  }, []);

  const history = useMemo(
    () => ({
      replace: (path: string) => {
        navigate(path, { replace: true });
      },
    }),
    [location]
  );

  const routerConfig = useMemo(
    () => ({ history, location: location as LocationOrHref }),
    [history, location]
  );

  if (!appBridgeConfig) {
    return (
      <Page>
        <Layout>
          <Layout.Section>
            <Spinner />
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Provider config={appBridgeConfig} router={routerConfig}>
      {children}
    </Provider>
  );
}
