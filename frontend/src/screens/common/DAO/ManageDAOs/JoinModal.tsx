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
  createdDAOs: Array<any>;
  joinedDAOs: Array<any>;
  allDAOs: any;
  onClose: Function;
  theme: any;
  classes: any;
};

type State = {
  joinDAOTab: number;
  shouldJoinDAOsList: Array<any>;
  restDAOs: Array<any>;
  code: Record<string, any>;
  currentFocusedInput: number;
};

class JoinModal extends React.Component<Props, State> {
  inputRefs: any = [];
  state = {
    joinDAOTab: 0,
    restDAOs: [],
    shouldJoinDAOsList: [],
    code: {},
    currentFocusedInput: 0,
  };

  componentDidMount() {
    this._updateShouldJoinDAOsList(this.props);
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(
        idx(this.props, (_) => _.createdDAOs),
        idx(prevProps, (_) => _.createdDAOs),
      ) ||
      !isEqual(
        idx(this.props, (_) => _.joinedDAOs),
        idx(prevProps, (_) => _.joinedDAOs),
      ) ||
      !isEqual(
        idx(this.props, (_) => _.allDAOs.data),
        idx(prevProps, (_) => _.allDAOs.data),
      )
    ) {
      this._updateShouldJoinDAOsList(this.props);
    }
  }

  _updateShouldJoinDAOsList = (nextProps) => {
    const { joinedDAOs, createdDAOs, allDAOs } = nextProps;
    let restDAOs = (idx(allDAOs, (_: any) => _.data) || []).filter((dao) => {
      let found = false;
      if (!found) {
        found = find(createdDAOs || [], {
          id: dao.id,
        });
      }
      if (!found) {
        found = find(joinedDAOs || [], {
          id: dao.id,
        });
      }
      return !found;
    });
    restDAOs = restDAOs.map((dao) => ({
      ...dao,
      label: dao.name,
    }));
    this.setState({
      shouldJoinDAOsList: restDAOs,
      restDAOs,
    });
  };

  _onDAOSearch = (text) => {
    const { restDAOs } = this.state;
    const arr = restDAOs.filter(
      (dao: any) => dao.label.toLowerCase().indexOf(text.toLowerCase()) > -1,
    );
    this.setState({ shouldJoinDAOsList: arr });
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
    const { joinDAOTab, shouldJoinDAOsList, code } = this.state;
    return (
      <div className={classes.contentWrapper}>
        <ToggleButton
          labels={['I have an access code', 'Request access']}
          selectedIndex={joinDAOTab}
          onChange={(label, index) => {
            this.setState({ joinDAOTab: index });
          }}
          activeColor={theme.palette.primary.color1}
        />
        <div className={classes.fieldTitle}>
          {joinDAOTab === 0 ? 'Please type your 6 digit number' : 'DAO name'}
        </div>
        <div className={classes.joinDAOFieldContent}>
          {joinDAOTab === 0 ? (
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
              placeholder={'Search by typing dao name'}
              showClearIcon={false}
              onSearch={this._onDAOSearch}
              onInputChange={this._onDAOSearch}
              onItemClick={() => {}}
              items={shouldJoinDAOsList}
            />
          )}
        </div>
      </div>
    );
  };

  _renderButtons = () => {
    const { theme, classes, onClose } = this.props;
    const { joinDAOTab } = this.state;
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
            title={joinDAOTab === 0 ? 'Join DAO' : 'Request Access'}
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
