import { withStyles } from '@kudoo/components';
import React from 'react';
import ComingSoon from 'src/screens/common/ComingSoon';
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
