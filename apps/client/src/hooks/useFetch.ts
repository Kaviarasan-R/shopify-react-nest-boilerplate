import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch } from "@shopify/app-bridge/utilities";
import { Redirect } from "@shopify/app-bridge/actions";
import { useStore } from "@/stores";

function useFetch() {
  const app = useAppBridge();
  const fetchFunction = authenticatedFetch(app);
  const embedded = useStore((state) => state.embedded);
  const shop = useStore((state) => state.shop);
  const host = useStore((state) => state.host);

  return async (uri: string, options?: RequestInit | undefined) => {
    const response = await fetchFunction(
      `https://${process.env.SHOPIFY_APP_ORIGIN}${uri}?embedded=${embedded}&shop=${shop}&host=${host}`,
      options
    );

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/exitframe`);
      return null;
    }

    return response;
  };
}

export default useFetch;
