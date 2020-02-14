import React, { Component } from 'react';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {
  withStyles,
  Button,
  SectionHeader,
  TextField,
  withStylesProps,
} from '@kudoo/components';
import actions from '@client/store/actions/createNewProject';
// import { State } from '@client/store/reducers/createNewProject';
import { IReduxState } from '@client/store/reducers';
import idx from 'idx';
import styles from './styles';

type Props = {
  makeStepActive: Function;
  markedVisited: Function;
  updateProjectName: Function;
  createNewProject: any;
  classes: any;
  theme: any;
};

class ProjectStep extends Component<Props, {}> {
  render() {
    const { classes, theme, updateProjectName, createNewProject } = this.props;
    return (
      <div>
        <SectionHeader
          title='Create a new project'
          subtitle='A project allows you to manage your customers and billing payments.'
          renderLeftPart={() => (
            <div className={classes.prevNextWrapper}>
              <Button
                title='Next'
                id='next-button'
                classes={{ component: classes.prevNextButton }}
                applyBorderRadius
                compactMode
                buttonColor={theme.palette.primary.color2}
                onClick={() => {
                  this.props.makeStepActive(1);
                  this.props.markedVisited(0);
                }}
              />
            </div>
          )}
        />
        <Grid container classes={{ container: classes.content }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={'Project name'}
              id='project-name'
              name='project-name'
              placeholder={'Eg. Work for Netflix'}
              value={createNewProject.name}
              onChangeText={updateProjectName}
              showClearIcon={false}
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const connected = connect(
  (state: IReduxState) => ({
    createNewProject: idx(state, x => x.sessionData.newProject),
  }),
  { ...actions }
)(ProjectStep);

export default withStyles(styles)(connected);
