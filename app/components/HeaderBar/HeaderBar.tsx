import { Text } from "@shopify/polaris";
import classes from "./HeaderBar.module.scss";
import cx from "classnames";
interface HeaderBarProps {
  right?: React.ReactNode;
  className?: string;
  headerTitle: string;
  headerDescription: string;
}
export const HeaderBar: React.FC<HeaderBarProps> = ({right, headerTitle, headerDescription, ...props}) => {
  return (
    <div {...props} className={cx(classes.header_bar_container, props.className)}>
      <div className={classes.header_bar_left}>
        {headerTitle && (
          <Text variant="headingLg" as="p">
            {headerTitle}
          </Text>
        )}
        {headerDescription && (
          <Text variant="bodySm" as="p">
            {headerDescription}
          </Text>
        )}
      </div>
      {right && <div className={classes.header_bar_right}>{right}</div>}
    </div>
  );
};
export default HeaderBar;
