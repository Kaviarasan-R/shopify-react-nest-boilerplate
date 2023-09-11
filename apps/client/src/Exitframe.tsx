import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { HorizontalStack, Spinner } from "@shopify/polaris";
import { useEffect } from "react";

const ExitFrame = () => {
  const app = useAppBridge();

  useEffect(() => {
    const shop = new URLSearchParams(location.search).get("shop");
    const host = new URLSearchParams(location.search).get("host");
    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      `${process.env.SHOPIFY_APP_URL}/auth?shop=${shop}&host=${host}`
    );
  }, []);

  return (
    <HorizontalStack blockAlign="center" align="center">
      <Spinner />
    </HorizontalStack>
  );
};

export default ExitFrame;
