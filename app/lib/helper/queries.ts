import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../moduls/limitation/api';
import type * as Types from 'app/moduls/limitation/types';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.products.getAll(),
  });
};

export const useLimitations = (params: Types.IApi.List.Params) => {
  return useQuery({
    queryKey: ['limitations', params],
    queryFn: () => api.limitations.getAll(params),
  });
};

export const useCheckoutLimitations = (params: { shopId: string, variantId: string, sku: string }) => {
  return useQuery({
    queryKey: ['checkoutLimitations', params],
    queryFn: () => api.limitations.getCheckoutLimitations(params),
  });
};

export const useSaveLimitations = () => {
  const queryClient = useQueryClient();
  const { mutate: syncMetafields } = useSyncMetafields();

  return useMutation({
    mutationFn: api.limitations.save,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limitations'] });
      syncMetafields();
    },
  });
};

export const useWarningMessages = () => {
  return useQuery({
    queryKey: ['warningMessages'],
    queryFn: api.warningMessages.get,
  });
};

export const useSaveWarningMessages = () => {
  const queryClient = useQueryClient();
  const { mutate: syncMetafields } = useSyncMetafields();

  return useMutation({
    mutationFn: async (messages: { minMessage: string; maxMessage: string }) => {
      const response = await fetch("/api/warning-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minMessage: messages.minMessage,
          maxMessage: messages.maxMessage,
        }),
      });
      if (!response.ok) throw new Error('Failed to save messages');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warningMessages'] });
      syncMetafields();
    },
  });
};

export const useUpdateVariantLimitations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.limitations.updateVariants,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limitations'] });
    },
  });
};

export const useSyncMetafields = () => {
  return useMutation({
    mutationFn: api.metafields.sync,
    onError: (error) => {
      console.error('Failed to sync metafields:', error);
    }
  });
};

export const useDeleteLimitations = () => {
  const queryClient = useQueryClient();
  const { mutate: syncMetafields } = useSyncMetafields();

  return useMutation({
    mutationFn: api.limitations.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['limitations'] });
      syncMetafields();
    },
  });
};

