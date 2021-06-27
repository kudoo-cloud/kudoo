import { createAction } from 'redux-actions';
import Types from '../types/createNewPatient';

export const updatePatientCreationOption = createAction(
  Types.CP_UPDATE_PATIENT_CREATION_OPTION,
);

export const resetManualData = createAction(Types.CP_RESET_MANUAL_DATA);
export const setManualStep1 = createAction(Types.CP_MANUAL_STEP1);
export const setManualStep2 = createAction(Types.CP_MANUAL_STEP2);
