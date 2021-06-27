import {
  Button,
  ErrorBoundary,
  SectionHeader,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as React from 'react';
import SelectedCompany from 'src/helpers/SelectedCompany';
import stylesFn from './styles';
import { SimpleCreatePageProps } from './types';

export type SimpleCreatePageRenderPropFormTypes = FormikProps<FormikValues> & {
  isContentDirty: boolean;
};

const SimpleCreatePage: React.FC<SimpleCreatePageProps> = (props) => {
  const {
    classes,
    onCompanyChange,
    editMode,
    header,
    children,
    initialValues,
    validationSchema,
    onSubmit,
    theme,
    onCancel,
  } = props;

  const renderSectionHeading = () => {
    if (!header) return null;

    const {
      createSubtitle,
      updateSubtitle,
      updateTitle,
      createTitle,
      ...rest
    } = header;
    return (
      <SectionHeader
        title={editMode ? updateTitle : createTitle}
        subtitle={editMode ? updateSubtitle : createSubtitle}
        classes={{ component: classes.sectionHeader }}
        {...rest}
      />
    );
  };

  const renderForm = () => {
    return (
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formProps) => {
          const formDirty = formProps.dirty;
          const childrenProps: SimpleCreatePageRenderPropFormTypes = {
            ...formProps,
            isContentDirty: formDirty,
          };
          return (
            <form className={classes.form} onSubmit={formProps.handleSubmit}>
              {typeof children === 'function'
                ? children(childrenProps)
                : children}
              <Grid container spacing={0}>
                <Grid item xs={12} sm={formDirty ? 6 : 12}>
                  <Button
                    title='Cancel'
                    buttonColor={theme.palette.grey['200']}
                    classes={{ text: classes.cancelButtonText }}
                    type='button'
                    onClick={onCancel}
                  />
                </Grid>
                {formDirty && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      loading={formProps.isSubmitting}
                      id='submit-button'
                      type='submit'
                      title={editMode ? 'Update' : 'Save'}
                      buttonColor={theme.palette.primary.color2}
                    />
                  </Grid>
                )}
              </Grid>
            </form>
          );
        }}
      </Formik>
    );
  };

  return (
    <ErrorBoundary>
      <SelectedCompany onChange={onCompanyChange}>
        <div className={classes.page}>
          {renderSectionHeading()}
          {renderForm()}
        </div>
      </SelectedCompany>
    </ErrorBoundary>
  );
};

export default withStyles(stylesFn)(
  SimpleCreatePage,
) as React.FC<SimpleCreatePageProps>;
