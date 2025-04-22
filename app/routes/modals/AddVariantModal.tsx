import {
  Modal,
  IndexTable,
  Text,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import React, { useCallback, useEffect, useState } from "react";
import type * as LimitationTypes from "app/moduls/limitation/types";
import { useProducts, useUpdateVariantLimitations } from "app/lib/helper/queries";
import { Type } from "app/moduls/limitation/constants";
import { useLimitationsContext } from "app/moduls/limitation/context/context";

interface IProps {
  isAddVariantModalOpen: boolean;
  setIsAddVariantModalOpen: (open: boolean) => void;
  onLimitationsChange?: (limitations: Array<LimitationTypes.IApi.ILimitation>) => void;
  limitations: Array<LimitationTypes.IApi.ILimitation>;
}

export const AddVariantModal: React.FC<IProps> = ({
  isAddVariantModalOpen,
  setIsAddVariantModalOpen,
  onLimitationsChange,
}) => {
  const { data: products = [] } = useProducts();
  const { mutate: updateVariantLimitations, isPending } = useUpdateVariantLimitations();
  const {limitations } = useLimitationsContext();
  const [existingLimitations, setExistingLimitations] =
    useState<Array<LimitationTypes.IApi.ILimitation>>(limitations);

  useEffect(() => {
    setExistingLimitations(limitations);
  }, [limitations]);

  const handleCloseAddVariantModal = useCallback(() => {
    setIsAddVariantModalOpen(false);
  }, [setIsAddVariantModalOpen]);

  const handleSaveVariants = useCallback(() => {
    const variantLimitations = existingLimitations.filter(
      limitation => limitation.type === Type.VARIANT
    );

    if (variantLimitations.length === 0) {
      handleCloseAddVariantModal();
      return;
    }

    const formattedLimitations = variantLimitations.map((limitation) => ({
      id: limitation.id,
      itemId: limitation.itemId || limitation.id,
      type: limitation.type,
      name: limitation.name,
      min: parseInt(limitation.min),
      max: parseInt(limitation.max),
    }));

    updateVariantLimitations(formattedLimitations, {
      onSuccess: () => {
        if (onLimitationsChange) {
          onLimitationsChange(existingLimitations);
        }
        handleCloseAddVariantModal();
      },
      onError: (error) => {
        console.error("Error updating variant limitations:", error);
      },
    });
  }, [
    existingLimitations,
    onLimitationsChange,
    handleCloseAddVariantModal,
    updateVariantLimitations,
  ]);

  const handleVariantSelection = useCallback(
    (variantId: string | null, productId: string | null) => {
      if (productId) {
        const product = products.find((p) => p.id === productId);
        const variantIds = product?.variants.map((v) => v.id) || [];

        const allVariantsSelected = variantIds.every((id: string) =>
          existingLimitations.some((item) => item.id === id),
        );

        if (allVariantsSelected) {
          setExistingLimitations((prev) =>
            prev.filter((item) => !variantIds.includes(item.id)),
          );
        } else {
          setExistingLimitations((prev) => {
            const newLimitations = [...prev];
            variantIds.forEach((id: string) => {
              if (!newLimitations.some((item) => item.id === id)) {
                const variant = product?.variants.find((v) => v.id === id);
                const variantToAdd: LimitationTypes.IApi.ILimitation = {
                  id: id,
                  name: variant?.title || "",
                  itemId: variant?.id || "",
                  min: "0",
                  max: "0",
                  type: Type.VARIANT,
                };
                newLimitations.push(variantToAdd);
              }
            });
            return newLimitations;
          });
        }
      } else if (variantId) {
        const isVariantSelected = existingLimitations.some(
          (item) => item.itemId === variantId,
        );

        if (isVariantSelected) {
          setExistingLimitations((prev) =>
            prev.filter((item) => item.itemId !== variantId),
          );
        } else {
          const product = products.find((p) =>
            p.variants.some((v) => v.id === variantId),
          );
          const variant = product?.variants.find((v) => v.id === variantId);

          const variantToAdd: LimitationTypes.IApi.ILimitation = {
            id: variantId,
            name: variant?.title || "",
            min: "0",
            max: "0",
            sku: variant?.sku || "",
            type: Type.VARIANT,
            itemId: variant?.id || "",
          };

          setExistingLimitations((prev) => [...prev, variantToAdd]);
        }
      }
    },
    [products, existingLimitations],
  );

  useEffect(() => {
    if (onLimitationsChange) {
      onLimitationsChange(existingLimitations);
    }
  }, [existingLimitations, onLimitationsChange]);

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(products as unknown as { [key: string]: unknown }[]);

  const rowMarkup = products.map((product, index) => {
    const variants = product.variants || [];
    const allVariantsSelected = variants.every((variant) =>
      existingLimitations.some((item) => item.id === variant.id),
    );

    // Skip rendering if product has only one variant and it's not "Default Title"
    if (variants.length === 1 && variants[0].title === "Default Title") {
      return null;
    }

    return (
      <React.Fragment key={product.id}>
        <IndexTable.Row
          rowType="data"
          id={product.id}
          position={index}
          selected={allVariantsSelected}
          onClick={() => handleVariantSelection(null, product.id)}
        >
          <IndexTable.Cell>
            <Text as="span" fontWeight="bold">
              {product.title}
            </Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <Text as="span">{variants.length} variants</Text>
          </IndexTable.Cell>
        </IndexTable.Row>

        {variants.map(
          (variant, variantIndex) => {
            return (
              variant.title !== "Default Title" && (
                <IndexTable.Row
                  rowType="child"
                  key={variant.id}
                  id={variant.id}
                  position={index + variantIndex + 1}
                  selected={existingLimitations.some(
                    (item) => item.itemId === variant.id,
                  )}
                  onClick={() => handleVariantSelection(variant.id, null)}
                >
                  <IndexTable.Cell>
                    <div style={{ paddingLeft: "20px" }}>
                      <Text as="span" variant="bodyMd">
                        {variant.title}
                      </Text>
                    </div>
                  </IndexTable.Cell>
                  <IndexTable.Cell>
                    <Text as="span">SKU: {variant.sku || "N/A"}</Text>
                  </IndexTable.Cell>
                </IndexTable.Row>
              )
            );
          }
        )}
      </React.Fragment>
    );
  });

  return (
    <Modal
      open={isAddVariantModalOpen}
      onClose={handleCloseAddVariantModal}
      title="Add variants"
      primaryAction={{
        content: "Save",
        onAction: handleSaveVariants,
        loading: isPending,
        disabled: existingLimitations.length === 0,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleCloseAddVariantModal,
        },
      ]}
    >
      <IndexTable
        condensed={useBreakpoints().smDown}
        resourceName={resourceName}
        itemCount={products.length}
        selectedItemsCount={
          allResourcesSelected ? "All" : selectedResources.length
        }
        onSelectionChange={handleSelectionChange}
        headings={[{ title: "Name" }, { title: "Variants" }]}
      >
        {rowMarkup}
      </IndexTable>
    </Modal>
  );
};

export default AddVariantModal;
