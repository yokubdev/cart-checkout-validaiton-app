import type * as LimitationTypes from "./types";

export const ProductMapper = (product: LimitationTypes.IApi.Product): LimitationTypes.IApi.ProductList => {
  return {
    id: product.id,
    title: product.title,
    variants:  product.variants.nodes.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
      })),
  };
};
