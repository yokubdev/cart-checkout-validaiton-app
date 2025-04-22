import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { LimitationsService } from "../lib/server/limitations.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;

  try {
    const messages = await LimitationsService.getWarningMessages(shopId);

    return json({
      min: messages.minMessage,
      max: messages.maxMessage
    });
  } catch (error: unknown) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}

export async function action({ request }: ActionFunctionArgs) {
  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const data = await request.json();

  try {
    await LimitationsService.saveWarningMessages(
      shopId,
      data.minMessage,
      data.maxMessage
    );

    return json({
      min: data.minMessage,
      max: data.maxMessage
    });
  } catch (error: unknown) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}

