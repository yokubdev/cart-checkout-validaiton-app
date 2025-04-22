import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { prisma } from '../lib/server/db.server';
import { Type } from "app/moduls/limitation/constants";

interface LimitationAcc {
  vs: Record<string, { min: number; max: number }>;
  ss: Record<string, { min: number; max: number }>;
}

export async function action({ request }: { request: Request }) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { session, admin } = await authenticate.admin(request);
    const shopId = session.shop;

    const [limitations, warningMessage] = await Promise.all([
      prisma.limitation.findMany({
        where: { shopId }
      }),
      prisma.warningMessage.findUnique({
        where: { shopId }
      })
    ]);

    const formattedLimitations = limitations.reduce((acc: LimitationAcc, limitation) => {
      const key = limitation.type === Type.SKU ? 'ss' : 'vs';
      const id = limitation.itemId;

      if (!acc[key]) acc[key] = {};
      acc[key][id] = {
        min: limitation.min,
        max: limitation.max
      };

      return acc;
    }, { vs: {}, ss: {} });

    const shopResponse = await admin.graphql(`
      query getShop {
        shop {
          id
        }
      }
    `);

    const shopData = await shopResponse.json();

    const shopGid = shopData.data.shop.id;

    const [limitationsResponse, warningMessagesResponse] = await Promise.all([
      admin.graphql(`
        mutation UpdateShopMetafield($input: MetafieldsSetInput!) {
          metafieldsSet(metafields: [$input]) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            namespace: "limitations",
            key: "shop_limitations",
            type: "json",
            value: JSON.stringify(formattedLimitations),
            ownerId: shopGid
          }
        }
      }),
      admin.graphql(`
        mutation UpdateWarningMessages($input: MetafieldsSetInput!) {
          metafieldsSet(metafields: [$input]) {
            metafields {
              id
              namespace
              key
              value
            }
            userErrors {
              field
              message
            }
          }
        }
      `, {
        variables: {
          input: {
            namespace: "limitations",
            key: "warning_messages",
            type: "json",
            value: JSON.stringify({
              min: warningMessage?.minMessage || "",
              max: warningMessage?.maxMessage || ""
            }),
            ownerId: shopGid
          }
        }
      })
    ]);

    const [limitationsResult, warningMessagesResult] = await Promise.all([
      limitationsResponse.json(),
      warningMessagesResponse.json()
    ]);

    if (limitationsResult.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error('GraphQL userErrors:', limitationsResult.data.metafieldsSet.userErrors);
      return json({
        error: limitationsResult.data.metafieldsSet.userErrors[0].message
      }, { status: 400 });
    }

    if (warningMessagesResult.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error('GraphQL userErrors:', warningMessagesResult.data.metafieldsSet.userErrors);
      return json({
        error: warningMessagesResult.data.metafieldsSet.userErrors[0].message
      }, { status: 400 });
    }

    return json({
      success: true,
      data: {
        limitations: formattedLimitations,
        warningMessages: {
          min: warningMessage?.minMessage || "",
          max: warningMessage?.maxMessage || ""
        }
      }
    });
  } catch (error) {
    console.error('Error syncing metafields:', error);
    return json({
      error: error instanceof Error ? error.message : 'Failed to sync metafields'
    }, { status: 500 });
  }
}

export const loader = async ({ request }: { request: Request }) => {
  const { admin } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(`
      query GetShopMetafields {
        shop {
          metafield(namespace: "limitations", key: "shop_limitations") {
            id
            namespace
            key
            value
          }
          warningMessages: metafield(namespace: "limitations", key: "warning_messages") {
            id
            namespace
            key
            value
          }
        }
      }
    `);

    const data = await response.json();

    return json({
      success: true,
      data: data.data.shop
    });

  } catch (error) {
    console.error('Error fetching metafields:', error);
    return json({
      error: error instanceof Error ? error.message : 'Failed to fetch metafields'
    }, { status: 500 });
  }
};