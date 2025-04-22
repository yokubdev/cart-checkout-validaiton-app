import { ProductMapper } from './mapper';
import type * as Types from 'app/moduls/limitation/types';

export const api = {
  products: {
    getAll: async (): Promise<Types.IApi.ProductList[]> => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('failed to fetch products');
      const data = await response.json();
      return (data.products || []).map(ProductMapper);
    },
  },

  limitations: {
    getAll: async (params: Types.IApi.List.Params) => {
      const searchParams = new URLSearchParams();
      if (params.type) searchParams.append('type', params.type);
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.pageSize) searchParams.append('pageSize', params.pageSize.toString());

      const response = await fetch(`/api/shop-limitations?${searchParams}`);
      if (!response.ok) throw new Error('failed to fetch limitations');
      return response.json();
    },

    save: async (limitations: Types.IApi.Limitation[]) => {
      const response = await fetch('/api/shop-limitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limitations),
      });
      if (!response.ok) throw new Error('failed to save limitations');
      return response.json();
    },

    getCheckoutLimitations: async (params: { shopId: string, variantId: string, sku: string }) => {
      const searchParams = new URLSearchParams();
      searchParams.append('shop', params.shopId);
      searchParams.append('type', params.sku ? 'SKU' : 'VARIANT');
      searchParams.append('itemId', params.sku || params.variantId);

      const response = await fetch(`/api/shop-limitations?${searchParams}`);
      if (!response.ok) throw new Error('failed to fetch checkout limitations');
      return response.json();
    },

    updateVariants: async (limitations: Types.IApi.Limitation[]) => {
      const response = await fetch('/api/shop-limitations/variants', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(limitations),
      });
      if (!response.ok) throw new Error('failed to update variant limitations');
      return response.json();
    },

    delete: async (ids: string[]) => {
      const response = await fetch('/api/shop-limitations/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error('failed to delete limitations');
      return response.json();
    }
  },

  warningMessages: {
    get: async (): Promise<Types.IApi.WarningMessage> => {
      const response = await fetch('/api/warning-messages');
      if (!response.ok) throw new Error('failed to fetch warning messages');
      return response.json();
    },
  },

  metafields: {
    sync: async (): Promise<Types.IApi.MetafieldResponse> => {
      const response = await fetch('/api/sync-metafields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) throw new Error('Failed to sync metafields');
      return response.json();
    },

    get: async (): Promise<Types.IApi.MetafieldResponse> => {
      const response = await fetch('/api/sync-metafields', {
        method: 'GET',
      });

      if (!response.ok) throw new Error('Failed to get metafields');
      return response.json();
    }
  }
};
