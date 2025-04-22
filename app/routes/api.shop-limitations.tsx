import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { LimitationsService } from "../lib/server/limitations.server";

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const data = await request.json();

  try {
    const limitations = data.map((item: any) => ({
      itemId: item.itemId,
      type: item.type,
      name: item.name,
      min: parseInt(item.min),
      max: parseInt(item.max)
    }));

    await LimitationsService.saveLimitations(shopId, limitations);

    return json({ success: true });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const url = new URL(request.url);

  const type = url.searchParams.get("type") as 'VARIANT' | 'SKU' | undefined;
  const page = parseInt(url.searchParams.get("page") || "1");
  const pageSize = parseInt(url.searchParams.get("pageSize") || "50");

  try {
    const result = await LimitationsService.getLimitations(shopId, {
      type,
      page,
      pageSize
    });

    return json(result);
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
