import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary
} from "@tanstack/react-query";
import { useState } from "react";
import { LimitationsProvider } from "./moduls/limitation/context/context";

export const loader = async () => {
  return { dehydratedState: null };
};

export default function App() {
  const { dehydratedState } = useLoaderData<typeof loader>();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: true,
      },
    },
  }));

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://cdn.shopify.com/" />
        <link
          rel="stylesheet"
          href="https://cdn.shopify.com/static/fonts/inter/v4/styles.css"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <HydrationBoundary state={dehydratedState}>
            <LimitationsProvider>
              <Outlet />
            </LimitationsProvider>
          </HydrationBoundary>
        </QueryClientProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
