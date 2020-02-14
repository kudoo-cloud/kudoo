import React, { Component } from 'react';
import { compose } from 'recompose';
import { Trans } from '@lingui/react';
import Grid from '@material-ui/core/Grid';
import { withStyles, TextField, ToggleSwitch } from '@kudoo/components';
import { ServiceInputRowStyles } from './styles';

type Props = {
  classes: any;
};
type State = {};

class ServiceInputRow extends Component<Props, State> {
  state = {};

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>
        <Grid container>
          <Grid item xs={12} sm={6} classes={{ item: classes.fieldCell }}>
            <TextField
              placeholder='Enter Name'
              showClearIcon={false}
              classes={{
                textInputWrapper: classes.textInputWrapper,
                textInput: classes.textInput,
                leftIcon: classes.leftIcon,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1} classes={{ item: classes.fieldCell }}>
            <TextField
              placeholder='0'
              showClearIcon={false}
              classes={{
                textInputWrapper: classes.textInputWrapper,
                textInput: classes.textInput,
                leftIcon: classes.leftIcon,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={1} classes={{ item: classes.fieldCell }}>
            <TextField
              placeholder='0'
              showClearIcon={false}
              icon={
                <div className={classes.dollarSign}>
                  <Trans id='currency-symbol' />
                </div>
              }
              classes={{
                textInputWrapper: classes.textInputWrapper,
                textInput: classes.textInput,
                leftIcon: classes.leftIcon,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2} classes={{ item: classes.fieldCell }}>
            <TextField
              placeholder='0'
              showClearIcon={false}
              icon={
                <div className={classes.dollarSign}>
                  <Trans id='currency-symbol' />
                </div>
              }
              classes={{
                textInputWrapper: classes.textInputWrapper,
                textInput: classes.textInput,
                leftIcon: classes.leftIcon,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={2} classes={{ item: classes.fieldCell }}>
            <div className={classes.gstInput}>
              <TextField
                placeholder='0'
                showClearIcon={false}
                icon={
                  <div className={classes.dollarSign}>
                    <Trans id='currency-symbol' />
                  </div>
                }
                classes={{
                  textInputWrapper: classes.textInputWrapper,
                  textInput: classes.textInput,
                  leftIcon: classes.leftIcon,
                }}
              />
              <ToggleSwitch compact />
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default compose(withStyles(ServiceInputRowStyles))(ServiceInputRow);
