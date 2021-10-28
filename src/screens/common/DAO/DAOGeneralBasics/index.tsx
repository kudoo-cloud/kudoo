import {
  Button,
  Dropdown,
  ErrorBoundary,
  SectionHeader,
  TextField,
  withStyles,
} from '@kudoo/components';
import { withI18n } from '@lingui/react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Grid from '@material-ui/core/Grid';
import { Formik } from 'formik';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import * as React from 'react';
import { useState } from 'react';
import Dropzone from 'react-dropzone';
import { useHistory, useRouteMatch } from 'react-router';
import { compose } from 'recompose';
import * as Yup from 'yup';
import { uploadFile } from 'src/api';
import {
  Currency,
  DaoFragment,
  useArchiveDaoMutation,
  useCreateDaoMutation,
  useDaoQuery,
  useGetUploadSignedUrlMutation,
  useUpdateDaoMutation,
} from 'src/generated/graphql';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { getDaoLogoKey, getFileExtension } from 'src/helpers/utilities';
import styles from './styles';
import { useActions, useData } from './useData';

interface IProps {
  i18n: any;
  theme: any;
  classes: any;
}

const DAOGeneralBasics: React.FC<IProps> = (props) => {
  const { theme, classes } = props;

  const [selectedLogo, setSelectedLogo] = useState(null as File);

  const match = useRouteMatch<any>();
  const history = useHistory();
  const [createDao] = useCreateDaoMutation();
  const [updateDao] = useUpdateDaoMutation();
  const [archiveDao] = useArchiveDaoMutation();
  const [getUploadSignedUrl] = useGetUploadSignedUrlMutation();

  const { data } = useDaoQuery({
    variables: {
      id: match?.params?.daoId,
    },
  });

  const { createdDAOs } = useData();
  const actions = useActions();

  const initialData = data?.dao || ({} as DaoFragment);
  const isCreateNewDAO = !initialData?.id;

  const uploadLogo = async (daoId: string) => {
    const logoKey = getDaoLogoKey(daoId, getFileExtension(selectedLogo.name));
    const mimeType = selectedLogo.type;

    const uploadUrlRes = await getUploadSignedUrl({
      variables: {
        mimeType,
        s3Key: logoKey,
      },
    });
    const signedUrlObj = uploadUrlRes?.data?.getUploadSignedUrl;
    const url = signedUrlObj?.url;
    await uploadFile(url, selectedLogo);
    let logoData = {
      id: initialData?.logo?.id || undefined,
      description: 'Dao Logo',
      fileName: selectedLogo.name,
      label: selectedLogo.name,
      s3Bucket: signedUrlObj?.s3Bucket,
      s3Key: signedUrlObj?.s3Key,
      s3Region: signedUrlObj?.s3Region,
    };
    return logoData;
  };

  const _submitForm = async (values, formActions) => {
    const { name, url, currency, cChainAddress } = values;

    let data = {
      id: undefined,
      name,
      currency,
      websiteUrl: url,
      cChainAddress,
      logo: undefined,
    };

    try {
      if (isCreateNewDAO) {
        // if create new dao
        const res = await createDao({
          variables: {
            createDaoInput: data,
          },
        });
        if (res?.data?.createDao?.id) {
          const daoRes = { ...res?.data?.createDao, owner: true };
          await actions.setUserData({
            selectedDAO: daoRes,
            createdDAOs: [...(createdDAOs || []), daoRes], // this is useful for updating dao list when we go back to manage DAOs
          });
          if (selectedLogo) {
            let logoData = await uploadLogo(res?.data?.createDao?.id);
            data = {
              ...data,
              logo: logoData,
            };

            // update logo in dao
            await updateDao({
              variables: {
                updateDaoInput: {
                  ...data,
                  id: res?.data?.createDao?.id,
                },
              },
            });
          }
          formActions.setSubmitting(false);
          showToast(null, 'DAO created');
          actions.setTemporaryActiveLanguage(undefined);
          history.push(URL.MANAGE_DAOS());
        }
      } else {
        // if update existing dao
        if (selectedLogo) {
          let logoData = await uploadLogo(initialData?.id);
          data = {
            ...data,
            logo: logoData,
          };
        }

        const res = await updateDao({
          variables: {
            updateDaoInput: {
              ...data,
              id: initialData.id,
            },
          },
        });
        if (res?.data?.updateDao?.id) {
          // await refetch();
          formActions.setSubmitting(false);
          showToast(null, 'DAO Updated');
          actions.setTemporaryActiveLanguage(undefined);
          history.push(URL.MANAGE_DAOS());
        }
      }
    } catch (e) {
      formActions.setSubmitting(false);
      showToast(e.toString());
      console.log('e===', e);
    }
  };

  // const removeLogo = async () => {
  //   try {
  //     const res = await this.props.removeLogo({
  //       where: {
  //         id: get(initialData, 'logo.id'),
  //       },
  //     });
  //     if (res.success) {
  //       await this.props.refetch();
  //       showToast(null, 'Logo removed successfully');
  //     } else {
  //       res.error.map((err) => showToast(err));
  //     }
  //   } catch (e) {
  //     showToast(e.toString());
  //   }
  // };

  const deleteDAO = async () => {
    try {
      const res = await archiveDao({
        variables: {
          id: initialData?.id,
        },
      });
      if (res?.data?.archiveDao?.id) {
        showToast(null, 'DAO archived successfully');
        actions.setUserData({
          selectedDAO: {},
        });
        history.replace(URL.MANAGE_DAOS());
      }
    } catch (e) {
      showToast(e.toString());
    }
  };

  const showDeleteDAOModal = async () => {
    const title = 'Delete this DAO account?';
    const description = (
      <div>
        <div>
          {`You are trying to delete the DAO `}
          <span className={classes.deleteDaoName}>
            {" '" + initialData.name + "' "}
          </span>
        </div>
        <br />
        <div>
          {`Please note that this is a permanent action and it can't be reversed.`}
        </div>
        <div>All users linked to this DAO will be affected.</div>
        <br />
        <div>Are you sure you want to delete DAO ?</div>
      </div>
    );
    const buttons = [
      {
        title: 'Cancel',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Delete DAO',
        id: 'modal-delete-dao',
        buttonColor: theme.palette.secondary.color2,
        onClick: () => {
          deleteDAO();
          actions.closeAlertDialog();
        },
      },
    ];
    const titleColor = theme.palette.secondary.color2;
    actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  const renderDAOLogoSection = () => {
    const dropzoneStyle = {
      width: 360,
      height: 130,
      border: '2px dashed #e5e5e5',
      borderRadius: 5,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    const daoLogo = get(initialData, 'logo.url')
      ? get(initialData, 'logo.url')
      : undefined;
    const selectedLogoPreview = get(selectedLogo, 'preview');
    return (
      <React.Fragment>
        <SectionHeader
          title='DAO Logo'
          classes={{ component: classes.sectionHeading }}
        />
        <div className={classes.logoImageWrapper}>
          <div className={classes.dropzoneAreaWrapper}>
            <div>
              {selectedLogoPreview || daoLogo ? (
                <div
                  className={classes.uploadedLogoPreview}
                  style={{
                    backgroundImage: `url(${selectedLogoPreview || daoLogo})`,
                  }}
                >
                  <Dropzone
                    className={classes.selectNewImageText}
                    multiple={false}
                    accept='image/*'
                    onDropAccepted={(file) => {
                      setSelectedLogo(file[0]);
                    }}
                  >
                    Select new image
                  </Dropzone>
                </div>
              ) : (
                <Dropzone
                  style={dropzoneStyle}
                  multiple={false}
                  accept='image/*'
                  onDropAccepted={(file) => {
                    setSelectedLogo(file[0]);
                  }}
                >
                  <div className={classes.dropzoneText}>
                    Select or Drop image
                  </div>
                </Dropzone>
              )}
            </div>
            {/* {Boolean(daoLogo) && (
              <ButtonBase
                classes={{ root: classes.deleteIcon }}
                onClick={removeLogo}
              >
                <i className='icon icon-trash' />
              </ButtonBase>
            )} */}
          </div>
          <div className={classes.imageNote}>
            {`This logo appears on your DAO invoice.`}
            <br />
            {`This logo file can't exceed 5mb`}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderForm = (formProps) => {
    const {
      values,
      errors,
      touched,
      setFieldValue,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      dirty,
    } = formProps;
    return (
      <React.Fragment>
        <SectionHeader
          title='Basic Details'
          classes={{ component: classes.sectionHeading }}
        />
        <form className={classes.formWrapper} onSubmit={handleSubmit}>
          <Grid container spacing={0}>
            <Grid item xs={12} md={6}>
              <div className={classes.formFields}>
                <div className={classes.fieldRow}>
                  <TextField
                    name='name'
                    id='name'
                    label='DAO Name'
                    placeholder={'DAO Name'}
                    value={values.name}
                    showClearIcon={false}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                  />
                </div>

                <div className={classes.fieldRow}>
                  <Dropdown
                    label='Currency'
                    items={[
                      { label: Currency.Avax, value: Currency.Avax },
                      { label: Currency.Png, value: Currency.Png },
                      { label: Currency.Sherpa, value: Currency.Sherpa },
                    ]}
                    value={values.currency}
                    onChange={(item) => {
                      setFieldValue('currency', item.value);
                    }}
                    error={touched.currency && errors.currency}
                  />
                </div>

                <div className={classes.fieldRow}>
                  <TextField
                    name='url'
                    id='url'
                    label='Website URL'
                    placeholder={'Website URL'}
                    showClearIcon={false}
                    value={values.url}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </div>
            </Grid>
          </Grid>
          {!isCreateNewDAO && (
            <ButtonBase
              id='delete-dao'
              classes={{ root: classes.deleteDAOText }}
              onClick={showDeleteDAOModal}
            >
              Delete this DAO account
            </ButtonBase>
          )}
          <Grid container spacing={0}>
            <Grid item xs={12} md={dirty || selectedLogo ? 6 : 12}>
              <Button
                title={isCreateNewDAO ? 'Cancel' : 'Go Back'}
                href={URL.MANAGE_DAOS()}
                buttonColor={theme.palette.grey['200']}
                classes={{ text: classes.cancelButtonText }}
                target='_self'
              />
            </Grid>
            {(dirty || selectedLogo) && (
              <Grid item xs={12} md={6}>
                <Button
                  id='submit-button'
                  title={isCreateNewDAO ? 'Save' : 'Update'}
                  buttonColor={theme.palette.primary.color2}
                  loading={isSubmitting}
                  type='submit'
                />
              </Grid>
            )}
          </Grid>
        </form>
      </React.Fragment>
    );
  };

  const renderFormSection = () => {
    return (
      <Formik
        enableReinitialize
        initialValues={{
          name: initialData.name || '',
          currency: !isEmpty(initialData.currency)
            ? initialData.currency
            : Currency.Png,
          url: initialData.websiteUrl || '',
          cChainAddress: initialData?.cChainAddress || '',
        }}
        onSubmit={_submitForm}
        validationSchema={Yup.object().shape({
          name: Yup.string().required('Name is required'),
        })}
      >
        {renderForm.bind(this)}
      </Formik>
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>
        <div className={classes.content}>
          {renderDAOLogoSection()}
          {renderFormSection()}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default compose<any, any>(
  withI18n(),
  withStyles(styles),
)(DAOGeneralBasics);
