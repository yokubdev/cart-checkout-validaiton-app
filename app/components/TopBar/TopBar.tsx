import { Button, Text } from "@shopify/polaris";
import { ArrowLeftIcon } from "@shopify/polaris-icons";
import classes from "./TopBar.module.scss";

interface TopBarProps {
  right?: React.ReactNode;
}

export const TopBar:React.FC<TopBarProps> = ({right}) => {
  return (
    <div className={classes.top_bar_container}>
      <div className={classes.top_bar_left}>
        <Button icon={ArrowLeftIcon} variant="tertiary" size="medium" onClick={() => {}} />
        <div className={classes.top_bar_left__content}>
          <Text variant="headingLg" as="p">
            Product restriction
          </Text>
          <Text variant="bodySm" as="p">
            Control the number of products a user can buy.
          </Text>
        </div>
      </div>
      {right && <div className={classes.top_bar_right}>{right}</div>}
    </div>
  );
};
export default TopBar;
