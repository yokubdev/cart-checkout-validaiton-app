import React from 'react';
import { Text, Icon } from '@shopify/polaris';
import { AlertCircleIcon, AlertDiamondIcon, CheckCircleIcon } from '@shopify/polaris-icons';
import classes from './Banner.module.scss';
import cx from 'classnames';

export type BannerStatus = 'warning' | 'critical' | 'success';

export interface BannerProps {
  status: BannerStatus;
  content: React.ReactNode;
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({ status, content, className }) => {
  const getIcon = () => {
    switch (status) {
      case 'critical':
        return <Icon source={AlertCircleIcon} tone="critical" />;
      case 'warning':
        return <Icon source={AlertDiamondIcon} tone="warning" />;
      case 'success':
        return <Icon source={CheckCircleIcon} tone="success" />;
      default:
        return null;
    }
  };

  return (
    <div className={cx(classes.banner, classes[`banner_${status}`], className)}>
      <div className={classes.icon_container}>{getIcon()}</div>
      <div className={classes.content_container}>
        {typeof content === 'string' ? (
          <Text as="p" variant="bodyMd">
            {content}
          </Text>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default Banner;