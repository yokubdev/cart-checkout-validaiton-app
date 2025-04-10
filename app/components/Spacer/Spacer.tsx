import React from 'react';
import cx from 'classnames';
import classes from './Spacer.module.scss';

export interface SpacerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

export const Spacer: React.FC<SpacerProps> = ({ size = 'medium', className }) => {
  return <div className={cx(classes.spacer, classes[`spacer_${size}`], className)} />;
};

export default Spacer;
