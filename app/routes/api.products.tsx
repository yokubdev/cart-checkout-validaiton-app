import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export async function loader({ request }: { request: Request }) {
  const { admin } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(`
      {
        products(first: 50) {
          nodes {
            id
            title
            variants (first: 50) {
              nodes {
                id
                title
                sku
              }
            }
          }
        }
      }
    `);

    const {
      data: {
        products: { nodes },
      },
    } = await response.json();

    return json({ products: nodes });
  } catch (error) {
    console.error("Error fetching products:", error);
    return json({ products: [], error: (error as Error).message }, { status: 500 });
  }
}
