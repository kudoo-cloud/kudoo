import { DataImports, ErrorBoundary, withStyles } from '@kudoo/components';
import React, { Component } from 'react';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
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
        <SelectedDAO
          onChange={() => {
            this.props.history.push(URL.DATAIMPORT());
          }}
        >
          <div className={classes.dataImportPage}>
            <DataImports />
          </div>
        </SelectedDAO>
      </ErrorBoundary>
    );
  }
}

export default withStyles(styles)(DataImportFile);
