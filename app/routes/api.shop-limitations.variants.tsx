import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import type { LimitationInput} from "../lib/server/limitations.server";
import { LimitationsService } from "../lib/server/limitations.server";
import { Type } from "app/moduls/limitation/constants";
import type * as LimitationTypes from "app/moduls/limitation/types";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'PUT') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  const { session } = await authenticate.admin(request);
  const shopId = session.shop;
  const newVariantLimitations = await request.json() as LimitationTypes.IApi.ILimitation[];

  try {
    if (!Array.isArray(newVariantLimitations)) {
      return json({ error: 'Invalid input: limitations must be an array' }, { status: 400 });
    }

    const { data: existingLimitations } = await LimitationsService.getLimitations(shopId, {
      type: 'VARIANT'
    });

    const existingMap = new Map(
      existingLimitations.map((limit) => [limit.itemId, limit])
    );

    const newMap = new Map(
      newVariantLimitations.map((limit) => [limit.itemId, limit])
    );

    const limitationsToUpdate: LimitationInput[] = [];
    const limitationsToDelete = [];

    for (const [itemId, limitation] of newMap.entries()) {
      if (typeof itemId !== 'string') continue;
      const { name, min, max } = limitation as LimitationTypes.IApi.ILimitation;

      limitationsToUpdate.push({
        itemId,
        type: Type.VARIANT,
        name,
        min: Number(min),
        max: Number(max),
      });
    }

    for (const [itemId, limitation] of existingMap.entries()) {
      if (!newMap.has(itemId)) {
        limitationsToDelete.push(limitation.id);
      }
    }

    await LimitationsService.saveLimitations(shopId, limitationsToUpdate);

    for (const id of limitationsToDelete) {
      await LimitationsService.deleteLimitation(id);
    }

    return json({ success: true });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}
