import {
  Button,
  ErrorBoundary,
  SearchInput,
  TextField,
  ToggleButton,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import idx from 'idx';
import find from 'lodash/find';
import isEqual from 'lodash/isEqual';
import range from 'lodash/range';
import * as React from 'react';
import { JoinModalStyles } from './styles';

type Props = {
  visible: boolean;
  createdCompanies: Array<any>;
  joinedCompanies: Array<any>;
  allCompanies: any;
  onClose: Function;
  theme: any;
  classes: any;
};

type State = {
  joinCompanyTab: number;
  shouldJoinCompaniesList: Array<any>;
  restCompanies: Array<any>;
  code: Record<string, any>;
  currentFocusedInput: number;
};

class JoinModal extends React.Component<Props, State> {
  inputRefs: any = [];
  state = {
    joinCompanyTab: 0,
    restCompanies: [],
    shouldJoinCompaniesList: [],
    code: {},
    currentFocusedInput: 0,
  };

  componentDidMount() {
    this._updateShouldJoinCompaniesList(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        idx(this.props, (_) => _.createdCompanies),
        idx(prevProps, (_) => _.createdCompanies),
      ) ||
      !isEqual(
        idx(this.props, (_) => _.joinedCompanies),
        idx(prevProps, (_) => _.joinedCompanies),
      ) ||
      !isEqual(
        idx(this.props, (_) => _.allCompanies.data),
        idx(prevProps, (_) => _.allCompanies.data),
      )
    ) {
      this._updateShouldJoinCompaniesList(this.props);
    }
  }

  _updateShouldJoinCompaniesList = (nextProps) => {
    const { joinedCompanies, createdCompanies, allCompanies } = nextProps;
    let restCompanies = (idx(allCompanies, (_: any) => _.data) || []).filter(
      (company) => {
        let found = false;
        if (!found) {
          found = find(createdCompanies || [], {
            id: company.id,
          });
        }
        if (!found) {
          found = find(joinedCompanies || [], {
            id: company.id,
          });
        }
        return !found;
      },
    );
    restCompanies = restCompanies.map((company) => ({
      ...company,
      label: company.name,
    }));
    this.setState({
      shouldJoinCompaniesList: restCompanies,
      restCompanies,
    });
  };

  _onCompanySearch = (text) => {
    const { restCompanies } = this.state;
    const arr = restCompanies.filter(
      (company: any) =>
        company.label.toLowerCase().indexOf(text.toLowerCase()) > -1,
    );
    this.setState({ shouldJoinCompaniesList: arr });
  };

  _renderTitle = () => {
    const { classes } = this.props;
    return <div className={classes.title}>How do you want to join?</div>;
  };

  _onChangeCode = (value, index) => {
    const { code } = this.state;
    if (value) {
      this.setState({
        code: {
          ...code,
          [index]: value,
        },
      });
      if (index <= 4) {
        this._focus(index + 1);
      }
    } else {
      delete code[index];
      this.setState({ code });
    }
  };

  _onKeyUp = (e) => {
    const { currentFocusedInput } = this.state;
    if (e.keyCode === 37) {
      // Arrow left
      this._focus(currentFocusedInput - 1);
    } else if (e.keyCode === 39) {
      // Arrow right
      this._focus(currentFocusedInput + 1);
    }
  };

  _focus = (index) => {
    if (index >= 0 && index <= 5) {
      this.setState({ currentFocusedInput: index });
      this.inputRefs[index].focus();
    }
  };

  _renderContent = () => {
    const { theme, classes } = this.props;
    const { joinCompanyTab, shouldJoinCompaniesList, code } = this.state;
    return (
      <div className={classes.contentWrapper}>
        <ToggleButton
          labels={['I have an access code', 'Request access']}
          selectedIndex={joinCompanyTab}
          onChange={(label, index) => {
            this.setState({ joinCompanyTab: index });
          }}
          activeColor={theme.palette.primary.color1}
        />
        <div className={classes.fieldTitle}>
          {joinCompanyTab === 0
            ? 'Please type your 6 digit number'
            : 'Company name'}
        </div>
        <div className={classes.joinCompanyFieldContent}>
          {joinCompanyTab === 0 ? (
            <Grid container spacing={8}>
              {range(0, 6).map((number) => (
                <Grid item xs={2} key={number}>
                  <TextField
                    placeholder={'-'}
                    getRef={(ref) => {
                      this.inputRefs[number] = ref;
                    }}
                    value={code[number] || ''}
                    showClearIcon={false}
                    maxlength={1}
                    onKeyUp={(e) => this._onKeyUp(e)}
                    onChangeText={(text) => {
                      this._onChangeCode(text, number);
                    }}
                    classes={{ textInput: classes.accessCodeField }}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <SearchInput
              placeholder={'Search by typing company name'}
              showClearIcon={false}
              onSearch={this._onCompanySearch}
              onInputChange={this._onCompanySearch}
              onItemClick={() => {}}
              items={shouldJoinCompaniesList}
            />
          )}
        </div>
      </div>
    );
  };

  _renderButtons = () => {
    const { theme, classes, onClose } = this.props;
    const { joinCompanyTab } = this.state;
    return (
      <Grid container classes={{ container: classes.buttons }}>
        <Grid item xs={6}>
          <Button
            classes={{ text: classes.cancelButtonText }}
            title='Cancel'
            onClick={onClose}
            buttonColor={theme.palette.grey['100']}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            buttonColor={theme.palette.primary.color2}
            title={joinCompanyTab === 0 ? 'Join Company' : 'Request Access'}
          />
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes, visible } = this.props;
    return (
      <ErrorBoundary>
        <div
          className={cx(classes.modalWrapper, {
            visible: visible,
            hide: !visible,
          })}
        >
          <div className={classes.modal}>
            {this._renderTitle()}
            {this._renderContent()}
            {this._renderButtons()}
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withStyles(JoinModalStyles)(JoinModal);
