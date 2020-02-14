import React, { Component } from 'react';
import { DataImports, ErrorBoundary, withStyles } from '@kudoo/components';
import URL from '@client/helpers/urls';
import SelectedCompany from '@client/helpers/SelectedCompany';
import styles from './styles';

interface IProps {
  classes: any;
  history: any;
  actions: any;
}

class DataImportFile extends Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Data Imports');
  }

  public render() {
    const { classes } = this.props;
    return (
      <ErrorBoundary>
        <SelectedCompany
          onChange={() => {
            this.props.history.push(URL.DATAIMPORT());
          }}>
          <div className={classes.dataImportPage}>
            <DataImports />
          </div>
        </SelectedCompany>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(DataImportFile);
