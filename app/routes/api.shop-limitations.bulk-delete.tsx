import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { LimitationsService } from "../lib/server/limitations.server";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'DELETE') {
    return json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids)) {
      return json({ error: 'Invalid input: ids must be an array' }, { status: 400 });
    }

    await Promise.all(ids.map(id => LimitationsService.deleteLimitation(id)));

    return json({ success: true });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    }, { status: 500 });
  }
}