import React, { useImperativeHandle } from 'react';
import findIndex from 'lodash/findIndex';
import {
  withStyles,
  Button,
  ErrorBoundary,
  WizardSteps,
} from '@kudoo/components';
import SelectedCompany from '@client/helpers/SelectedCompany';
import styles from './styles';
import { WizardCreatePageProps as Props } from './types';

const WizardCreatePage: React.FC<Props> = props => {
  const {
    classes,
    theme,
    onCompanyChange,
    onCancel,
    steps,
    onStepChange,
    forwardedRef,
  } = props;

  useImperativeHandle(forwardedRef, () => ({
    goToNextStep,
    goToPrevStep,
  }));

  const currentStepIndex = (): number => {
    return findIndex(steps, { active: true });
  };

  const goToNextStep = () => {
    const currentIndex = currentStepIndex();
    if (currentIndex <= steps.length - 1) {
      _markedVisited(currentIndex);
      _makeStepActive(currentIndex + 1);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = currentStepIndex();
    if (currentIndex > 0) {
      _unmarkedVisited(currentIndex);
      _makeStepActive(currentIndex - 1);
    }
  };

  const _makeStepActive = (index: number) => {
    const newSteps = [...steps];
    const pos: number = findIndex(newSteps, { active: true });
    if (pos > -1) {
      // make current step inactive
      newSteps[pos] = {
        ...newSteps[pos],
        active: false,
      };
      // make next step active
      newSteps[index] = {
        ...newSteps[index],
        active: true,
      };
    }
    if (onStepChange) {
      onStepChange(newSteps);
    }
  };

  const _markedVisited = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      visited: true,
    };
    if (onStepChange) {
      onStepChange(newSteps);
    }
  };

  const _unmarkedVisited = (index: number) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      visited: false,
    };
    if (onStepChange) {
      onStepChange(newSteps);
    }
  };

  return (
    <ErrorBoundary>
      <SelectedCompany onChange={onCompanyChange}>
        <div className={classes.page}>
          <div className={classes.allSteps}>
            <WizardSteps steps={steps} />
          </div>
          <div>
            <Button
              title='Cancel'
              buttonColor={theme.palette.grey['200']}
              classes={{ text: classes.cancelButtonText }}
              onClick={onCancel}
            />
          </div>
        </div>
      </SelectedCompany>
    </ErrorBoundary>
  );
};

const StyledWizard = withStyles(styles)(WizardCreatePage) as React.FC<Props>;

export default React.forwardRef((props: Props, ref) => (
  <StyledWizard {...props} forwardedRef={ref} />
));
