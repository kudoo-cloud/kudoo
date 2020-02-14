import React, { useState, useRef, useEffect } from 'react';
import { withStyles, ErrorBoundary } from '@kudoo/components';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import WizardCreatePage from '@client/common_screens/WizardCreatePage';
import idx from 'idx';
import { IReduxState } from '@client/store/reducers';
import SelectOptionStep from './Steps/SelectOption';
import BulkUpload from './Steps/BulkUpload';
import PatientSearch from './Steps/PatientSearch';
import ManualStepOne from './Steps/ManualStepOne';
import ManualStepTwo from './Steps/ManualStepTwo';
import styles, { StyleKeys } from './styles';

type Props = IRouteProps<StyleKeys> & {
  actions: any;
  resetNewProjectData: Function;
  patientCreationOption?: string;
};

type StepsRef = {
  current: {
    goToNextStep: Function;
    goToPrevStep: Function;
  };
};

const CreateNewPatient: React.FC<Props> = props => {
  const stepsRef: StepsRef = useRef(null);
  const goToNextStep = () => {
    stepsRef.current.goToNextStep();
  };
  const goToPrevStep = () => {
    stepsRef.current.goToPrevStep();
  };

  const initialSteps = [
    {
      label: 'Patient',
      active: true,
      component: <SelectOptionStep goToNextStep={goToNextStep} />,
    },
    {
      label: 'Next',
      component: <div />,
    },
  ];

  const [steps, setSteps] = useState(initialSteps);

  const updateSteps = () => {
    let nextSteps = [];
    if (props.patientCreationOption === 'BULK_UPLOAD') {
      nextSteps = [
        {
          label: 'Bulk Upload',
          component: <BulkUpload />,
        },
      ];
    } else if (props.patientCreationOption === 'SEARCH') {
      nextSteps = [
        {
          label: 'Patient Search',
          component: <PatientSearch goToNextStep={goToNextStep} />,
        },
      ];
    } else if (props.patientCreationOption === 'MANUAL') {
      nextSteps = [
        {
          label: 'Manual Entry',
          component: <ManualStepOne goToNextStep={goToNextStep} />,
        },
        {
          label: 'More Details',
          component: <ManualStepTwo goToNextStep={goToNextStep} />,
        },
      ];
    }
    setSteps([initialSteps[0], ...nextSteps]);
  };

  useEffect(updateSteps, [props.patientCreationOption]);

  return (
    <ErrorBoundary>
      <WizardCreatePage steps={steps} onStepChange={setSteps} ref={stepsRef} />
    </ErrorBoundary>
  );
};

export default compose<Props, Props>(
  withStyles(styles),
  connect((state: IReduxState) => ({
    patientCreationOption: idx(
      state,
      x => x.sessionData.newPatient.patientCreationOption
    ),
  }))
)(CreateNewPatient);
