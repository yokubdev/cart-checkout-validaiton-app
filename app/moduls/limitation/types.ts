import type { Type } from "./constants";

export declare namespace IApi {
  export namespace List {
    export interface Params {
      type?: Type;
      page?: number|string;
      pageSize?: number|string;
    }
    export interface Response {
      data: ILimitation[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        pageSize: number;
      };
    }
  }

export interface ILimitation extends Record<string, unknown> {
  id: string;
  name: string;
  min: string;
  max: string;
  sku?: string;
  itemId: string;
  type: Type;
}
export interface IFilter {
  key: string;
  label: string;
  filter: React.ReactNode;
}
export interface IAppliedFilter {
  key: string;
  label: string;
  onRemove: () => void;
}
export interface Product {
  id: string;
  title: string;
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku: string;
    }>;
  };
}
export interface Variant {
  id: string;
  title: string;
  sku: string;
}
export interface ProductList {
  id: string;
  title: string;
  variants: Variant[];
}
export interface Limitation {
  id: string;
  itemId: string;
  type: Type;
  name: string;
  min: number;
  max: number;
}
export interface WarningMessage {
  min: string;
  max: string;
}
export interface MetafieldResponse {
  success: boolean;
  data?: {
    vs: Record<string, { min: number; max: number }>;
    ss: Record<string, { min: number; max: number }>;
  };
  error?: string;
  }
}