import { ReactNode, ReactChildren } from 'react';
import { FormikValues, FormikActions } from 'formik';

export type StyleKeys = 'page' | 'sectionHeader' | 'form' | 'cancelButtonText';

export type SimpleCreatePageProps<Values = FormikValues> = IComponentProps<
  StyleKeys
> & {
  onCompanyChange?: Function;
  editMode?: boolean;
  header?: {
    createTitle?: ReactNode;
    updateTitle?: ReactNode;
    createSubtitle?: ReactNode;
    updateSubtitle?: ReactNode;
  };
  initialValues: Values;
  validationSchema?: any;
  onSubmit?: (values: Values, actions: FormikActions<Values>) => void;
  onCancel?: Function;
};
