import {
  Button,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import get from 'lodash/get';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import ProjectProgress from './ProjectProgress';
import styles from './styles';

type Props = {
  actions: any;
  archiveProject?: Function;
  onMarkAsComplete: () => void;
  projectCompleted: boolean;
  progressSteps: Array<any>;
  project: Record<string, any>;
  i18n?: any;
  history: any;
  match: any;
  theme: any;
  classes: any;
};

type State = {};

class ProjectDetailsTab extends Component<Props, State> {
  public static defaultProps = {
    archiveProject: () => ({}),
    project: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  _archiveProject = async () => {
    const { history, match } = this.props;
    const id = get(match, 'params.id', '');
    try {
      const res = await this.props.archiveProject({
        where: { id },
        data: { isArchived: true },
      });
      if (res.success) {
        showToast(null, 'Archived successfully');
        history.push(URL.PROJECTS());
      } else {
        res.error.map((err) => showToast(err));
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  _showArchivedDialog = () => {
    const { theme, classes, project } = this.props;
    const title = 'Archive this project?';
    const description = (
      <div>
        <div>
          You are trying to archive the project{' '}
          <span className={classes.archiveProjectName}>
            {get(project, 'data.name')}
          </span>
          .
        </div>
        <br />
        <div>
          If you archive this project then you will not have access to it until
          you unarchive it from the project list page.
        </div>
        <br />
        <div>Are you sure you want to archive this project?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          this.props.actions.closeAlertDialog();
        },
      },
      {
        title: 'Archive this project',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          this._archiveProject();
          this.props.actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color1;
    this.props.actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  render() {
    const { classes, projectCompleted, project, theme, progressSteps, i18n } =
      this.props;
    const customer = get(project, 'data.customer') || {};
    return (
      <ErrorBoundary>
        <div className={classes.tabContentWrapper}>
          <SectionHeader
            title='Project Details'
            subtitle='Check the details below'
            renderLeftPart={() =>
              !projectCompleted ? (
                <Button
                  title='Mark as Complete'
                  applyBorderRadius
                  width={250}
                  buttonColor={theme.palette.primary.color2}
                  onClick={this.props.onMarkAsComplete}
                />
              ) : (
                <Button
                  title='Customer has paid'
                  applyBorderRadius
                  width={250}
                  buttonColor={theme.palette.primary.color2}
                  onClick={() => {}}
                />
              )
            }
          />
          <Grid container>
            <Grid item xs={12} sm={5}>
              <div className={classes.projectNameWrapper}>
                <TextField
                  label='Project Name'
                  isReadOnly
                  disabled
                  value={get(project, 'data.name') || ''}
                />
              </div>
            </Grid>
          </Grid>

          <div className={classes.progressWrapper}>
            <ProjectProgress steps={progressSteps} />
          </div>

          <div className={classes.customerDetailsWrapper}>
            <SectionHeader
              title='Customer Details'
              renderLeftPart={() => {
                if (get(project, 'data.isArchived', false)) {
                  return null;
                }
                return (
                  <Button
                    title='Edit customer details'
                    withoutBackground
                    applyBorderRadius
                    width={250}
                    buttonColor={theme.palette.primary.color2}
                    compactMode
                    href={
                      customer.id
                        ? URL.CUSTOMER_DETAILS({
                            id: customer.id,
                          })
                        : ''
                    }
                  />
                );
              }}
            />
            <div className={classes.details}>
              <div className={classes.detailWrapper}>
                <div className={classes.detailValue}>{customer.name}</div>
                <div className={classes.detailKey}>Comapny</div>
              </div>
              <div className={classes.detailWrapper}>
                <div className={classes.detailValue}>
                  {get(customer, 'contacts[0].name')}{' '}
                  {get(customer, 'contacts[0].surname')}
                </div>
                <div className={classes.detailKey}>Contact name</div>
              </div>
              <div className={classes.detailWrapper}>
                <div className={classes.detailValue}>
                  {get(customer, 'contacts[0].email')}
                </div>
                <div className={classes.detailKey}>Email</div>
              </div>
              <div className={classes.detailWrapper}>
                <div className={classes.detailValue}>
                  {get(customer, 'govNumber')}
                </div>
                <div className={classes.detailKey}>{i18n._(`ABN`)}</div>
              </div>
            </div>
          </div>

          {!get(project, 'data.isArchived', false) && (
            <ButtonBase
              classes={{ root: classes.archiveProjectButton }}
              onClick={this._showArchivedDialog}
            >
              Archive Project
            </ButtonBase>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}

export default compose<Props, Props>(
  withI18n(),
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withUpdateProject(() => ({
  //   name: 'archiveProject',
  // })),
  // withProject((props) => ({
  //   id: get(props, 'match.params.id', ''),
  // })),
)(ProjectDetailsTab);
