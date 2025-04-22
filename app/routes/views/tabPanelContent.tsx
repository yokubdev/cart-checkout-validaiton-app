import type * as LimitationTypes from "app/moduls/limitation/types";
import ProductLimitations from "./limiterPage";
import WarningMessages from "./warningMessagePage";


export interface IProps {
  limitations: LimitationTypes.IApi.ILimitation[];
  setLimitations: React.Dispatch<React.SetStateAction<LimitationTypes.IApi.ILimitation[]>>;
  setIsAddVariantModalOpen: (isAddVariantModalOpen: boolean) => void;
  isSavingMessages: boolean;
  setIsSavingMessages: (isSavingMessages: boolean) => void;
}
export const tabPanelContent: { [key: string]: (props: IProps) => React.ReactNode } = {
  PRODUCT_LIMITS: (props: IProps) => <ProductLimitations {...props} />,
  WARNING_MESSAGES: (props: IProps) => <WarningMessages {...props} />
};
