import ExitFrame from "@/Exitframe";
import NotFound from "@/NotFound";

import Index from "@/pages/Index";
import DebugIndex from "@/pages/debug/DebugIndex";
import ActiveWebhooks from "@/pages/debug/ActiveWebhooks";
import GetData from "@/pages/debug/GetData";
import BillingAPI from "@/pages/debug/BillingAPI";
import DevNotes from "@/pages/debug/DevNotes";

const routes = {
  "/": () => <Index />,
  "/debug": () => <DebugIndex />,
  "/debug/activeWebhooks": () => <ActiveWebhooks />,
  "/debug/getData": () => <GetData />,
  "/debug/billing": () => <BillingAPI />,
  "/debug/devNotes": () => <DevNotes />,
  "/exitframe": () => <ExitFrame />,
  "*": () => <NotFound />,
};

export default routes;
