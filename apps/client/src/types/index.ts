export interface IAppProps {
  children: React.ReactNode;
}

export interface AppBridgeProviderProps {
  children: React.ReactNode;
}

export interface AppBridgeConfig {
  host: string;
  apiKey: string;
  forceRedirect: boolean;
}

export interface ApolloClientProviderProps {
  children: React.ReactNode;
}
