import { ErrorBoundary, withStyles } from '@kudoo/components';
import idx from 'idx';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import WizardCreatePage from 'src/screens/common/WizardCreatePage';
import { IReduxState } from 'src/store/reducers';
import BulkUpload from './Steps/BulkUpload';
import ManualStepOne from './Steps/ManualStepOne';
import ManualStepTwo from './Steps/ManualStepTwo';
import PatientSearch from './Steps/PatientSearch';
import SelectOptionStep from './Steps/SelectOption';
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

const CreateNewPatient: React.FC<Props> = (props) => {
  const stepsRef: StepsRef = useRef(null);
  const goToNextStep = () => {
    stepsRef.current.goToNextStep();
  };
  // const goToPrevStep = () => {
  //   stepsRef.current.goToPrevStep();
  // };

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      (x) => x.sessionData.newPatient.patientCreationOption,
    ),
  })),
)(CreateNewPatient);
