import { NavigationMenu } from "@shopify/app-bridge-react";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { usePath, useRoutes } from "raviger";
import routes from "./Routes";
import ApolloClientProvider from "@/providers/ApolloClientProvider";
import { AppBridgeProvider } from "@/providers/AppBridgeProvider";

const App: React.FunctionComponent = () => {
  const currentPath = usePath();
  const RouteComponents = useRoutes(routes);

  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <NavigationMenu
          navigationLinks={[
            {
              label: "Fetch Data",
              destination: "/debug/getData",
            },
            {
              label: "Billing API",
              destination: "/debug/billing",
            },
          ]}
          matcher={(link) => currentPath === link.destination}
        />
        <ApolloClientProvider>{RouteComponents}</ApolloClientProvider>
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

export default App;
