import { Layout, Page } from "@shopify/polaris";
import TopBar from "../components/TopBar/TopBar";
import { useState, useCallback } from "react";
import Tabs from "../components/Tabs";
import { TabItemContent, TabPanel } from "app/components/Tabs/Tabs";
import { AlertCircleIcon, ProductIcon } from "@shopify/polaris-icons";
import AddVariantModal from "./modals/AddVariantModal";
import { tabPanelContent } from "./views/tabPanelContent";
import type * as LimitationTypes from "app/moduls/limitation/types";

export default function LimitationPage() {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [isSavingMessages, setIsSavingMessages] = useState(false);
  const [limitations, setLimitations] = useState<LimitationTypes.IApi.ILimitation[]>([]);

  const handleTabChange = useCallback(
    (selectedTabIndex: number) => setSelectedTabIndex(selectedTabIndex),
    [],
  );

  const pageTabs = [
    {
      id: "all-customers-fitted-2",
      content: (
        <TabItemContent
          icon={<ProductIcon />}
          title="Products Limit"
          description="Product selection for quantity limitation"
        />
      ),
      accessibilityLabel: "Products Limit",
      panelId: "PRODUCT_LIMITS",
    },
    {
      id: "accepts-marketing-fitted-2",
      content: (
        <TabItemContent
          icon={<AlertCircleIcon />}
          title="Warning Message"
          description="Warning message that users will see when they reach the limits"
        />
      ),
      accessibilityLabel: "Accepts marketing",
      panelId: "WARNING_MESSAGES",
    },
  ];

  const selectedTab = pageTabs[selectedTabIndex];

  return (
    <>
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
              (tab, _) =>
                selectedTab.panelId === tab.panelId && (
                  <TabPanel key={tab.id} id={selectedTab.id} isActive={true}>
                    {tabPanelContent[selectedTab.panelId]({
                      limitations,
                      setLimitations,
                      isSavingMessages,
                      setIsSavingMessages,
                      setIsAddVariantModalOpen,
                    })}
                  </TabPanel>
                ),
            )}
          </Layout.Section>
        </Layout>
      </Page>
      <AddVariantModal
        isAddVariantModalOpen={isAddVariantModalOpen}
        setIsAddVariantModalOpen={setIsAddVariantModalOpen}
        onLimitationsChange={setLimitations}
        limitations={limitations}
      />
    </>
  );
}
