import { useCallback } from 'react';
import classes from './Tab.module.scss';
import cx from 'classnames';
import { Text } from '@shopify/polaris';

interface TabItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TabProps {
  id: string;
  content: React.ReactNode;
  accessibilityLabel: string;
}

interface TabsProps {
  onSelect: (selectedTabIndex: number) => void;
  activeIndex: number;
  tabs: TabProps[];
  className?: string;
  ariaLabel?: string;
}

interface ItemProps extends TabProps {
  index: number;
  isActive: boolean;
  onSelect: (selectedTabIndex: number) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  onSelect,
  activeIndex,
  tabs,
  className,
  ariaLabel = 'Tabs',
  ...props
}) => {
  return (
    <div
      {...props}
      role="tablist"
      aria-label={ariaLabel}
      className={cx(classes.list, className)}
    >
      {tabs.map((tab, index) => (
        <TabItem
          {...tab}
          key={tab.id || index}
          index={index}
          isActive={activeIndex === index}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

const TabItem: React.FC<ItemProps> = ({
  index,
  content,
  onSelect,
  id,
  isActive,
  accessibilityLabel,
}) => {
  const handleClick = useCallback(() => {
    onSelect(index);
  }, [index, onSelect]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect(index);
      }
    },
    [index, onSelect]
  );

  return (
    <div
      role="tab"
      id={`tab-${id}`}
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cx(classes.item, {
        [classes['item-active']]: isActive,
      })}
      aria-label={accessibilityLabel}
    >
      {content}
    </div>
  );
};

export const TabPanel: React.FC<{
  id: string;
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}> = ({ id, children, isActive, className }) => {
  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      hidden={!isActive}
      className={className}
    >
      {children}
    </div>
  );
};


export const TabItemContent: React.FC<TabItemProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <div className={classes.tabItem}>
      <div className={classes.tabItemIcon}>
        {icon}
      </div>
    <div className={classes.tabItemContent}>
      <Text variant="headingXs" as="p">{title}</Text>
        <Text variant="bodyXs" as="p">{description}</Text>
      </div>
    </div>
  );
};

export default Tabs;