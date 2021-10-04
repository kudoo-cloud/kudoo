import {
  Button,
  ErrorBoundary,
  Loading,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import omitDeep from 'omit-deep-lodash';
import React, { useEffect } from 'react';
import * as Yup from 'yup';
import {
  useDaoMultisigsByDaoQuery,
  useDeleteDaoMultisigMutation,
  useUpdateManyDaoMultisigsMutation,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import { useAllActions, useProfile } from 'src/store/hooks';
import styles from './styles';

interface IProps {
  classes: any;
  theme: any;
}

const Multisig: React.FC<IProps> = (props) => {
  const { classes, theme } = props;

  const actions = useAllActions();

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [deleteDaoMultisig] = useDeleteDaoMultisigMutation();

  const [updateManyDaoMultisigs] = useUpdateManyDaoMultisigsMutation();

  const { data, loading, refetch } = useDaoMultisigsByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  const multisigData = data?.daoMultisigsByDao;

  useEffect(() => {
    actions.updateHeaderTitle('Multisig');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _submitForm = async (values, actions) => {
    try {
      if ((values?.multisig || []).length > 0) {
        const res = await updateManyDaoMultisigs({
          variables: {
            data: omitDeep(values?.multisig, '__typename'),
          },
        });
        if (res?.data?.updateManyDaoMultisigs?.[0]?.id) {
          showToast(null, 'Multisig updated successfully');
          refetch({
            daoId,
          });
        } else {
          res?.errors?.map((err) => showToast(err.message));
        }
        actions.setSubmitting(false);
      }
    } catch (e) {
      actions.setSubmitting(false);
    }
  };

  const _onAddNewMultisigRow = (values, setFieldValue) => {
    const newMultisigRows =
      (values?.multisig || []).length > 0 ? [...values?.multisig] : [];
    newMultisigRows.push({
      name: '',
      cChainAddress: '',
      daoId: daoId,
    });

    setFieldValue('multisig', newMultisigRows);
  };

  const removeData = (index, formProps) => {
    (formProps?.values['multisig']).splice(index, 1);
    formProps?.setFieldValue('multisig', formProps?.values['multisig']);
  };

  const showRemoveAlert = (row) => {
    const title = 'Delete Multisig';
    const description = `Are you sure you want to remove Multisig ?`;
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Remove',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => removeMultisig(row),
      },
    ];
    actions.showAlertDialog({
      title,
      description,
      titleColor: theme.palette.secondary.color2,
      buttons,
    });
  };

  const removeMultisig = async (row) => {
    try {
      const res = await deleteDaoMultisig({
        variables: { id: row.id },
      });
      if (res?.data?.deleteDaoMultisig?.id) {
        showToast(null, 'Multisig removed successfully');
        refetch({
          daoId,
        });
      }
    } catch (e) {
      showToast(e.toString());
    } finally {
      actions.closeAlertDialog();
    }
  };

  const _renderSectionHeading = () => {
    return (
      <Grid container item xs={12} sm={6}>
        <SectionHeader
          title='Update Multisig'
          subtitle='Update Multisig to update information in your account.'
          classes={{ component: classes.sectionHeader }}
        />
      </Grid>
    );
  };

  const _renderForm = () => {
    return (
      <Formik
        initialValues={{
          multisig:
            (multisigData || []).length > 0
              ? multisigData
              : [{ name: '', cChainAddress: '', daoId: daoId }],
        }}
        enableReinitialize
        validationSchema={Yup.object().shape({
          multisig: Yup.array().of(
            Yup.object().shape({
              name: Yup.string().required('Required'),
              cChainAddress: Yup.string().required('Required'),
            }),
          ),
        })}
        onSubmit={_submitForm}
      >
        {(formProps) => {
          const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            dirty,
          } = formProps;
          const isFormDirty = dirty;

          return (
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container classes={{ container: classes.formFields }}>
                <Grid item xs={12}>
                  <ErrorBoundary>
                    {(values?.['multisig'] || []).map((value, i) => {
                      return (
                        <div className={classes.component} key={i}>
                          <Grid container spacing={16}>
                            <Grid item xs={5}>
                              <TextField
                                placeholder={'E.g: Name'}
                                name={`multisig[${i}].name`}
                                value={value.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched?.multisig?.[i]?.name &&
                                  errors?.multisig?.[i]?.name
                                }
                                showClearIcon={false}
                              />
                            </Grid>

                            <Grid item xs={5}>
                              <TextField
                                placeholder={
                                  'C- Chain Address ex. 0x93e31CB3B4150AE82cAD1d369a7FddFE999999'
                                }
                                name={`multisig[${i}].cChainAddress`}
                                value={value?.cChainAddress}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={
                                  touched?.multisig?.[i]?.cChainAddress &&
                                  errors?.multisig?.[i]?.cChainAddress
                                }
                                showClearIcon={false}
                              />
                            </Grid>
                            <Grid item xs={2}>
                              <div
                                className={classes.removeIcon}
                                onClick={() => {
                                  if (value?.id) {
                                    showRemoveAlert(value);
                                  } else {
                                    removeData(i, formProps);
                                  }
                                }}
                              >
                                <i className='icon icon-close' />
                              </div>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })}

                    <span data-html2canvas-ignore>
                      <Button
                        title='New Row'
                        applyBorderRadius
                        width={200}
                        compactMode
                        buttonColor={theme.palette.primary.color2}
                        classes={{ component: classes.newRowButton }}
                        onClick={() =>
                          _onAddNewMultisigRow(values, setFieldValue)
                        }
                      />
                    </span>
                  </ErrorBoundary>
                </Grid>
              </Grid>
              <Grid container>
                {isFormDirty && (
                  <Grid item xs={12} sm={12}>
                    <Button
                      loading={isSubmitting}
                      title='Update Multisig'
                      id='submit-multisig'
                      buttonColor={theme.palette.primary.color2}
                      type='submit'
                      isDisabled={(values?.multisig || []).length === 0}
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
      <div className={classes.page}>
        {_renderSectionHeading()}
        {loading && <Loading />}
        {_renderForm()}
      </div>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(Multisig);
