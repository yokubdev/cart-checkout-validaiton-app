import {
  TextField,
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Text,
  ChoiceList,
  RangeSlider,
  useBreakpoints,
  Layout,
  Page,
  Button,
  Divider,
} from "@shopify/polaris";
import TopBar from "../components/TopBar/TopBar";
import type { IndexFiltersProps, TabProps } from "@shopify/polaris";
import { useState, useCallback } from "react";
import classes from "../styles/additional.module.scss";
import Panel from "../components/Panel/Panel";
import HeaderBar from "app/components/HeaderBar/HeaderBar";
import Tabs from "../components/Tabs";
import { TabPanel } from "app/components/Tabs/Tabs";
import { PlusIcon } from "@shopify/polaris-icons";
import Banner from "app/components/Banner/Banner";
import Spacer from "app/components/Spacer";

export default function AdditionalPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTabIndex(selectedTabIndex),
    [],
  );

  const pageTabs = [
    {
      id: "all-customers-fitted-2",
      content: "All",
      accessibilityLabel: "All customers",
      panelId: "PRODUCT_LIMITS",
    },
    {
      id: "accepts-marketing-fitted-2",
      content: "Accepts marketing",
      accessibilityLabel: "Accepts marketing",
      panelId: "WARNING_MESSAGES",
    },
  ];

  const selectedTab = pageTabs[selectedTabIndex];

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const [itemStrings, setItemStrings] = useState([
    "All",
    "SKU",
    "Product",
    "Variant",
  ]);
  const deleteView = (index: number) => {
    const newItemStrings = [...itemStrings];
    newItemStrings.splice(index, 1);
    setItemStrings(newItemStrings);
    setSelected(0);
  };

  const duplicateView = async (name: string) => {
    setItemStrings([...itemStrings, name]);
    setSelected(itemStrings.length);
    await sleep(1);
    return true;
  };

  const tabs: TabProps[] = itemStrings.map((item, index) => ({
    content: item,
    index,
    onAction: () => {},
    id: `${item}-${index}`,
    isLocked: index === 0,
    actions:
      index === 0
        ? []
        : [
            {
              type: "rename",
              onAction: () => {},
              onPrimaryAction: async (value: string): Promise<boolean> => {
                const newItemsStrings = tabs.map((item, idx) => {
                  if (idx === index) {
                    return value;
                  }
                  return item.content;
                });
                await sleep(1);
                setItemStrings(newItemsStrings);
                return true;
              },
            },
            {
              type: "duplicate",
              onPrimaryAction: async (value: string): Promise<boolean> => {
                await sleep(1);
                duplicateView(value);
                return true;
              },
            },
            {
              type: "edit",
            },
            {
              type: "delete",
              onPrimaryAction: async () => {
                await sleep(1);
                deleteView(index);
                return true;
              },
            },
          ],
  }));
  const [selected, setSelected] = useState(0);
  const onCreateNewView = async (value: string) => {
    await sleep(500);
    setItemStrings([...itemStrings, value]);
    setSelected(itemStrings.length);
    return true;
  };
  const sortOptions: IndexFiltersProps["sortOptions"] = [
    { label: "Customer", value: "customer asc", directionLabel: "A-Z" },
    { label: "Customer", value: "customer desc", directionLabel: "Z-A" },
    { label: "Min Limit", value: "min asc", directionLabel: "Ascending" },
    { label: "Min Limit", value: "min desc", directionLabel: "Descending" },
    { label: "Max Limit", value: "max asc", directionLabel: "Ascending" },
    { label: "Max Limit", value: "max desc", directionLabel: "Descending" },
  ];
  const [sortSelected, setSortSelected] = useState(["order asc"]);
  const { mode, setMode } = useSetIndexFiltersMode();
  const onHandleCancel = () => {};

  const onHandleSave = async () => {
    await sleep(1);
    return true;
  };

  const primaryAction: IndexFiltersProps["primaryAction"] =
    selected === 0
      ? {
          type: "save-as",
          onAction: onCreateNewView,
          disabled: false,
          loading: false,
        }
      : {
          type: "save",
          onAction: onHandleSave,
          disabled: false,
          loading: false,
        };
  const [accountStatus, setAccountStatus] = useState<string[] | undefined>(
    undefined,
  );
  const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
    undefined,
  );
  const [taggedWith, setTaggedWith] = useState("");
  const [queryValue, setQueryValue] = useState("");

  const handleAccountStatusChange = useCallback(
    (value: string[]) => setAccountStatus(value),
    [],
  );
  const handleMoneySpentChange = useCallback(
    (value: [number, number]) => setMoneySpent(value),
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
  const handleMoneySpentRemove = useCallback(
    () => setMoneySpent(undefined),
    [],
  );
  const handleTaggedWithRemove = useCallback(() => setTaggedWith(""), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);
  const handleFiltersClearAll = useCallback(() => {
    handleAccountStatusRemove();
    handleMoneySpentRemove();
    handleTaggedWithRemove();
    handleQueryValueRemove();
  }, [
    handleAccountStatusRemove,
    handleMoneySpentRemove,
    handleQueryValueRemove,
    handleTaggedWithRemove,
  ]);

  const filters = [
    {
      key: "accountStatus",
      label: "Account status",
      filter: (
        <ChoiceList
          title="Account status"
          titleHidden
          choices={[
            { label: "Enabled", value: "enabled" },
            { label: "Not invited", value: "not invited" },
            { label: "Invited", value: "invited" },
            { label: "Declined", value: "declined" },
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
    {
      key: "moneySpent",
      label: "Money spent",
      filter: (
        <RangeSlider
          label="Money spent is between"
          labelHidden
          value={moneySpent || [0, 500]}
          prefix="$"
          output
          min={0}
          max={2000}
          step={1}
          onChange={handleMoneySpentChange}
        />
      ),
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
  if (moneySpent) {
    const key = "moneySpent";
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, moneySpent),
      onRemove: handleMoneySpentRemove,
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

  const limitations = [
    {
      id: "1019",
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Retro Coffee Table
        </Text>
      ),
      min: "10",
      max: "20",
    },
    {
      id: "1018",
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Scandinavian Bed Frame
        </Text>
      ),
      min: "10",
      max: "20",
    },
    {
      id: "1017",
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          SKU:
        </Text>
      ),
      min: "10",
      max: "20",
    },
    {
      id: "1016",
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Scandinavian Bed Frame
        </Text>
      ),
      min: "10",
      max: "20",
    },
    {
      id: "1015",
      name: (
        <Text as="span" variant="bodyMd" fontWeight="semibold">
          Industrial Sideboard
        </Text>
      ),
      min: "10",
      max: "20",
    },
  ];
  const resourceName = {
    singular: "order",
    plural: "orders",
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(limitations);

  const rowMarkup = limitations.map(({ id, name, min, max }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      selected={selectedResources.includes(id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="bold" as="span">
          {name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          label=""
          type="number"
          value={min}
          autoComplete="off"
          onFocus={(e) => {
            e?.stopPropagation();
          }}
          onChange={(value) => {
            setMin(value);
          }}
        />
      </IndexTable.Cell>
      <IndexTable.Cell>
        <TextField
          label=""
          type="number"
          value={max}
          autoComplete="off"
          onFocus={(e) => {
            e?.stopPropagation();
          }}
          onChange={(value) => {
            setMax(value);
          }}
        />
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  const tabPanelContent: { [key: string]: React.ReactNode } = {
    PRODUCT_LIMITS: (
      <Panel className={classes.panel}>
        <HeaderBar
          headerTitle="Products to Limit"
          headerDescription="Product selection for quantity limitation"
          right={
            <>
              <Button icon={PlusIcon} size="medium" onClick={() => {}}>
                Add Product
              </Button>
              <Button icon={PlusIcon} size="medium" onClick={() => {}}>
                Add Variant
              </Button>
              <Button icon={PlusIcon} size="medium" onClick={() => {}}>
                Add SKU
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
          canCreateNewView
          onCreateNewView={onCreateNewView}
          filters={filters}
          appliedFilters={appliedFilters}
          onClearAll={handleFiltersClearAll}
          mode={mode}
          setMode={setMode}
        />
        <IndexTable
          condensed={useBreakpoints().smDown}
          resourceName={resourceName}
          itemCount={limitations.length}
          selectedItemsCount={
            allResourcesSelected ? "All" : selectedResources.length
          }
          onSelectionChange={handleSelectionChange}
          headings={[{ title: "Name" }, { title: "Min" }, { title: "Max" }]}
        >
          {rowMarkup}
        </IndexTable>
      </Panel>
    ),
    WARNING_MESSAGES: (
      <div className={classes.warning_messages_container}>
        <HeaderBar
          className={classes.warning_messages_header}
          headerTitle="Warning Message"
          headerDescription="Warning message that users will see when they reach the limits"
        />
        <Divider />
        <div className={classes.warning_messages_content}>
          <TextField
            label="Minimum quantity limit message"
            value={""}
            autoComplete="off"
            suffix={
              <Text as="span" variant="headingSm">
                0/50
              </Text>
            }
          />
          <Spacer size="small" />
          <Banner status="critical" content="Warning message that users will see when they reach the limits" />
          <Spacer size="large" />
          <TextField
            label="Maximum quantity limit message"
            value={""}
            autoComplete="off"
            suffix={
              <Text as="span" variant="headingSm">
                0/50
              </Text>
            }
          />
          <Spacer size="small" />
          <Banner status="critical" content="Warning message that users will see when they reach the limits" />
        </div>
      </div>
    ),
  };

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <TopBar />
        </Layout.Section>
        <Layout.Section>
          <Tabs
            tabs={pageTabs}
            activeIndex={selectedTabIndex}
            onSelect={handleTabChange}
          />
        </Layout.Section>
        <Layout.Section>
          {pageTabs.map(
            (tab, index) =>
              selectedTab.panelId === tab.panelId && (
                <TabPanel key={tab.id} id={selectedTab.id} isActive={true}>
                  {tabPanelContent[selectedTab.panelId]}
                </TabPanel>
              ),
          )}
        </Layout.Section>
      </Layout>
    </Page>
  );

  function disambiguateLabel(key: string, value: string | any[]): string {
    switch (key) {
      case "moneySpent":
        return `Money spent is between $${value[0]} and $${value[1]}`;
      case "taggedWith":
        return `Tagged with ${value}`;
      case "accountStatus":
        return (value as string[]).map((val) => `Customer ${val}`).join(", ");
      default:
        return value as string;
    }
  }

  function isEmpty(value: string | string[]): boolean {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }
}
function setMin(value: string) {
  throw new Error("Function not implemented.");
}

function setMax(value: string) {
  throw new Error("Function not implemented.");
}
