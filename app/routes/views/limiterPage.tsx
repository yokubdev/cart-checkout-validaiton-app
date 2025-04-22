import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import {
  Button,
  ChoiceList,
  IndexFilters,
  IndexFiltersMode,
  IndexTable,
  IndexTableSelectionType,
  Text,
  TextField,
  useBreakpoints,
  useIndexResourceState,
} from "@shopify/polaris";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "@remix-run/react";
import { PlusIcon } from "@shopify/polaris-icons";

import HeaderBar from "app/components/HeaderBar/HeaderBar";
import Panel from "app/components/Panel/Panel";
import { isEmpty } from "app/lib/helper/isEmpty";
import { disambiguateLabel } from "app/lib/helper/disambiguateLabel";
import type * as Types from "app/moduls/limitation/types";
import {
  useLimitations,
  useSaveLimitations,
  useDeleteLimitations,
} from "app/lib/helper/queries";

import classes from "app/styles/limitation.module.scss";
import { Type } from "app/moduls/limitation/constants";
import config from "app/config";
import { useLimitationsContext } from "app/moduls/limitation/context/context";

interface IProps {
  limitations: Types.IApi.ILimitation[];
  setLimitations: React.Dispatch<
    React.SetStateAction<Types.IApi.ILimitation[]>
  >;
  setIsAddVariantModalOpen: (isOpen: boolean) => void;
}

export const ProductLimitations: React.FC<IProps> = ({
  setIsAddVariantModalOpen,
}) => {
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const [queryValue, setQueryValue] = useState("");
  const [selected, setSelected] = useState(0);
  const [taggedWith, setTaggedWith] = useState("");
  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined,
  );

  const {limitations, setLimitations } = useLimitationsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const limitationsParam = searchParams.get("limitations");

  const currentPage =
    Number(searchParams.get("page")) || config.pagination.page;
  const pageSize =
    Number(searchParams.get("pageSize")) || config.pagination.pageSize;

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(limitations);

  const { data } = useLimitations({
    type:
      limitationsParam === Type.SKU
        ? Type.SKU
        : limitationsParam === Type.VARIANT
          ? Type.VARIANT
          : undefined,
    page: currentPage,
    pageSize,
  });

  const { mutate: saveLimitations, isPending } = useSaveLimitations();
  const { mutate: deleteLimitations, isPending: isDeleting } =
    useDeleteLimitations();

  const handleAccountStatusChange = useCallback(
    (value: string[]) => setAccountStatus(value),
    [],
  );

  const handleTaggedWithChange = useCallback(
    (value: string) => setTaggedWith(value),
    [],
  );

  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );

  const handleAccountStatusRemove = useCallback(
    () => setAccountStatus(undefined),
    [],
  );

  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const handleAddSku = useCallback(() => {
    const newLimitation: Types.IApi.ILimitation = {
      id: crypto.randomUUID(),
      itemId: crypto.randomUUID(),
      name: "",
      min: "0",
      max: "0",
      sku: "",
      type: Type.SKU,
      isSKU: true,
    };

    setLimitations((prevLimitations) => {
      const currentLimitations = prevLimitations || [];
      return [newLimitation, ...currentLimitations];
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedResources.length === 0) return;

    deleteLimitations(selectedResources, {
      onSuccess: () => {
        setLimitations((prevLimitations: Types.IApi.ILimitation[]) =>
          prevLimitations.filter(
            (item) => !selectedResources.includes(item.id),
          ),
        );
        handleSelectionChange(IndexTableSelectionType.All, false);
      },
      onError: (error) => {
        console.error("Error deleting limitations:", error);
        shopify.toast.show("Error deleting limitations", { isError: true });
      },
    });
  }, [selectedResources, deleteLimitations, handleSelectionChange]);

  const handleSaveLimitations = useCallback(() => {
    const limitationsToSave = limitations.map(
      (item: Types.IApi.ILimitation) => ({
        id: item.id,
        itemId: item.itemId || item.id,
        type: item.type,
        name: item.name,
        min: parseInt(item.min),
        max: parseInt(item.max),
      }),
    );

    saveLimitations(limitationsToSave);
  }, [limitations, saveLimitations]);

  useEffect(() => {
    if (data) {
      setLimitations(transformLimitationsData(data.data));
    }
  }, [data]);

  const transformLimitationsData = (data: any[]) => {
    return data.map((item: any) => ({
      id: item.id,
      itemId: item.itemId,
      type: item.type,
      name: item.name,
      min: String(item.min),
      max: String(item.max),
      isSKU: item.type === "SKU",
    }));
  };

  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Name", value: "name asc", directionLabel: "A-Z" },
    { label: "Name", value: "name desc", directionLabel: "Z-A" },
    { label: "Min Limit", value: "min asc", directionLabel: "Ascending" },
    { label: "Min Limit", value: "min desc", directionLabel: "Descending" },
    { label: "Max Limit", value: "max asc", directionLabel: "Ascending" },
    { label: "Max Limit", value: "max desc", directionLabel: "Descending" },
  ];

  const onHandleSave = async (value: string) => {
    searchParams.set("limitations", value);
    setSearchParams(searchParams);
    return true;
  };

  const primaryAction: IndexFiltersProps["primaryAction"] = {
    type: "save",
    onAction: onHandleSave,
    disabled: false,
    loading: false,
  };

  const onHandleCancel = () => {};

  const itemStrings = ["All", "SKU", "Variant"];

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {
      searchParams.set("limitations", item);
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    },
    id: `${item}-${index}`,
    isLocked: index === 0,
  }));

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          selected={accountStatus || []}
          onChange={handleAccountStatusChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: "taggedWith",
      label: "Tagged with",
      filter: (
        <TextField
          label="Tagged with"
          value={taggedWith}
          onChange={handleTaggedWithChange}
          autoComplete="off"
          labelHidden
        />
      ),
      shortcut: true,
    },
  ];

  const appliedFilters: IndexFiltersProps["appliedFilters"] = [];

  if (accountStatus && !isEmpty(accountStatus)) {
    const key = "accountStatus";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, accountStatus),
      onRemove: handleAccountStatusRemove,
    });
  }
  if (!isEmpty(taggedWith)) {
    const key = "taggedWith";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, taggedWith),
      onRemove: handleTaggedWithRemove,
    });
  }

  const handleSetMin = (id: string, value: string) => {
    setLimitations((prevLimitations: Types.IApi.ILimitation[]) =>
      prevLimitations.map((item) =>
        item.id === id ? { ...item, min: value } : item,
      ),
    );
  };

  const handleSetMax = (id: string, value: string) => {
    setLimitations((prevLimitations: Types.IApi.ILimitation[]) =>
      prevLimitations?.map((item) =>
        item.id === id ? { ...item, max: value } : item,
      ),
    );
  };

  const rowMarkup = limitations.map(
    (
      { id, name, min, max, type }: Types.IApi.ILimitation,
      index: number,
    ) => {
      return (
        <IndexTable.Row
          id={id}
          key={id}
          selected={selectedResources.includes(id)}
          position={index}
        >
          <IndexTable.Cell>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Text as="span" variant="bodyMd">
                {type === Type.SKU ? "SKU:" : ""}
              </Text>
              {type === Type.SKU ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <TextField
                    label=""
                    value={name || ""}
                    onChange={(value) => {
                      setLimitations(
                        (prevLimitations: Types.IApi.ILimitation[]) =>
                          prevLimitations.map((item) =>
                            item.id === id
                              ? { ...item, sku: value, name: value }
                              : item,
                          ),
                      );
                    }}
                    placeholder="SKU name"
                    autoComplete="off"
                  />
                </div>
              ) : (
                <Text as="span" variant="bodyMd">
                  {name}
                </Text>
              )}
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell scope="row" className={classes.table_cell}>
            <div onClick={(e) => e.stopPropagation()}>
              <TextField
                label=""
                type="number"
                value={min}
                min={0}
                autoComplete="off"
                onChange={(value) => {
                  handleSetMin(id, value);
                }}
              />
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell className={classes.table_cell}>
            <div onClick={(e) => e.stopPropagation()}>
              <TextField
                label=""
                type="number"
                value={max}
                autoComplete="off"
                min={0}
                onChange={(value) => {
                  handleSetMax(id, value);
                }}
              />
            </div>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    },
  );

  return (
    <>
      <Panel className={classes.panel}>
        <HeaderBar
          headerTitle="Products to Limit"
          headerDescription="Product selection for quantity limitation"
          right={
            <>
              {selectedResources.length > 0 && (
                <Button
                  variant="primary"
                  tone="critical"
                  loading={isDeleting}
                  onClick={handleDeleteSelected}
                >
                  Delete {selectedResources.length.toString()} selected
                </Button>
              )}
              <Button icon={PlusIcon} size="medium" onClick={handleAddSku}>
                Add SKU
              </Button>
              <Button
                variant="primary"
                icon={PlusIcon}
                size="medium"
                onClick={() => setIsAddVariantModalOpen(true)}
              >
                Add Variant
              </Button>
            </>
          }
        />
        <IndexFilters
          sortOptions={sortOptions}
          sortSelected={sortSelected}
          queryValue={queryValue}
          queryPlaceholder="Searching in all"
          onQueryChange={handleFiltersQueryChange}
          onQueryClear={() => setQueryValue("")}
          onSort={setSortSelected}
          primaryAction={primaryAction}
          cancelAction={{
            onAction: onHandleCancel,
            disabled: false,
            loading: false,
          }}
          tabs={tabs}
          selected={selected}
          onSelect={setSelected}
          canCreateNewView={false}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={IndexFiltersMode.Default}
          setMode={() => {}}
        />
        <IndexTable
          condensed={useBreakpoints().xsDown}
          resourceName={resourceName}
          itemCount={Number(data?.pagination.totalItems)}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[{ title: "Name" }, { title: "Min" }, { title: "Max" }]}
          loading={isPending}
          pagination={{
            hasNext: currentPage < Number(data?.pagination.totalPages),
            hasPrevious: currentPage > 1,
            onNext: () => {
              searchParams.set("page", (currentPage + 1).toString());
              setSearchParams(searchParams);
            },
            onPrevious: () => {
              searchParams.set("page", (currentPage - 1).toString());
              setSearchParams(searchParams);
            },
          }}
        >
          {rowMarkup}
        </IndexTable>
      </Panel>
      <div style={{ marginTop: "20px", float: "right" }}>
        <Button
          variant="primary"
          loading={isPending}
          onClick={handleSaveLimitations}
        >
          Save
        </Button>
      </div>
    </>
  );
};

export default ProductLimitations;
