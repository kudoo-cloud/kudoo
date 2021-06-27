import { FormikHelpers, FormikValues } from 'formik';
import { ReactNode } from 'react';

export type StyleKeys = 'page' | 'sectionHeader' | 'form' | 'cancelButtonText';

export type SimpleCreatePageProps<Values = FormikValues> =
  IComponentProps<StyleKeys> & {
    onCompanyChange?: (company: any) => void;
    editMode?: boolean;
    header?: {
      createTitle?: ReactNode;
      updateTitle?: ReactNode;
      createSubtitle?: ReactNode;
      updateSubtitle?: ReactNode;
    };
    initialValues: Values;
    validationSchema?: any;
    onSubmit?: (values: Values, actions: FormikHelpers<Values>) => void;
    onCancel?: Function;
  };
