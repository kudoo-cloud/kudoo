import React from 'react';
import { withStyles, withStylesProps } from '@kudoo/components';
import ComingSoon from '@client/common_screens/ComingSoon';
import styles from './styles';

interface IProps {
  actions?: any;
  invoices?: any;
  classes?: any;
  theme?: any;
}

class InvoicesTab extends React.Component<IProps, any> {
  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.section}>
        <ComingSoon />
      </div>
    );
  }
}

export default withStyles(styles)(InvoicesTab);
