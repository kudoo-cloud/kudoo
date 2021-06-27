import createTypes from 'redux-create-action-types';

interface ICreatePatientTypes {
  CP_UPDATE_PATIENT_CREATION_OPTION: string;
  CP_MANUAL_STEP1: string;
  CP_MANUAL_STEP2: string;
  CP_RESET_MANUAL_DATA: string;
  CP_PATIENT_RESET_DATA: string;
}

const types: ICreatePatientTypes = createTypes(
  'CP_UPDATE_PATIENT_CREATION_OPTION',
  'CP_MANUAL_STEP1',
  'CP_MANUAL_STEP2',
  'CP_RESET_MANUAL_DATA',
  'CP_PATIENT_RESET_DATA',
);

export type PatientCreationOption = 'BULK_UPLOAD' | 'SEARCH' | 'MANUAL' | '';

interface PatientName {
  name: string;
  isPrimary: boolean;
}

export interface INewPatientState {
  patientCreationOption: PatientCreationOption;
  manualPatient: {
    title: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    oneName: boolean;
    currentAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postCode: string;
    };
    birthAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postCode: string;
    };
    names?: PatientName[];
  };
}

export default types;
