import { Page, Layout, Text, Card, Button, BlockStack,Link } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="Product Quantity Limitation" />
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text as="h2" variant="headingMd">
                  Welcome to Product Quantity Limitation
                </Text>
                <Text variant="bodyMd" as="p">
                  Control the number of products a user can buy. Click below to get started.
                </Text>
                <Link url="/app/limitation" removeUnderline>
                  <Button variant="primary">Get Started</Button>
                </Link>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
