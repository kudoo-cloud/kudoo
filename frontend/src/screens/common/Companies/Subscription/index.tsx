import React, { useEffect, useState } from 'react';
import contents from '../../../../../kudoo.toml';
import { compose } from 'recompose';
import {
  withStyles,
  ErrorBoundary,
  TextField,
  SectionHeader,
  License,
  Button,
} from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import { withInvoices, withUpdateCompany } from '@kudoo/graphql';
import { INVOICE_STATUS } from '@client/helpers/constants';
import { showToast } from '@client/helpers/toast';
import get from 'lodash/get';
import { connect } from 'react-redux';
import idx from 'idx';
import { ICompanyEntity } from '@client/store/types';
import useDeepCompareEffect from '@client/helpers/useDeepCompareEffect';
import { IReduxState } from '@client/store/reducers';
import PaymentModal from './PaymentModal';
import styles, { StylesKeys } from './styles';

type IProps = IRouteProps<StylesKeys> & {
  company: ICompanyEntity;
  contentHash: string;
  paidInvoices: {
    total: number;
    count: number;
    refetch: () => void;
    loading: boolean;
  };
  updateCompany: Function;
};

type SelectedTierType = {
  index: number;
  pricing: {
    pricing: number;
    currency: string;
  };
  tier: {
    type: string;
  };
};

const UserDetails: React.FC<IProps> = props => {
  const { classes, theme, paidInvoices, company, updateCompany } = props;

  const [selectedPlan, setSelectedPlan] = useState(0);
  const [initialSelectedPlan, setInitialSelectedPlan] = useState(0);
  const [selectedTier, setSelectedTier] = useState({} as SelectedTierType);
  const [shouldShowPaymentModal, setShouldShowPaymentModal] = useState(false);
  const isDirty = initialSelectedPlan !== selectedPlan;

  useEffect(() => {
    const activePlanType = idx(company, x => x.activePlan.type);
    getInitialData();
    selectPlan(activePlanType);
  }, []);

  useDeepCompareEffect(() => {
    const activePlanType = idx(company, x => x.activePlan.type);
    getInitialData();
    selectPlan(activePlanType);
  }, [company]);

  const selectPlan = type => {
    let selectedPlan = 0;
    if (type === 'FREE') {
      selectedPlan = 0;
    } else if (type === 'PRO') {
      selectedPlan = 1;
    } else if (type === 'ENTERPRISE') {
      selectedPlan = 2;
    }
    setSelectedPlan(selectedPlan);
    setInitialSelectedPlan(selectedPlan);
  };

  const getInitialData = () => {
    const { refetch } = paidInvoices;
    refetch();
  };

  const onPaymentDone = async () => {
    closePaymentModal();
    const res = await updateCompany({
      data: {
        activePlan: {
          update: {
            type: selectedTier.tier.type,
            price: Number(selectedTier.pricing.pricing),
            currency: selectedTier.pricing.currency,
          },
        },
      },
      where: {
        id: company.id,
      },
    });
    if (res.success) {
      showToast(null, 'Plan updated successfully');
    } else {
      (idx(res, x => x.error) || []).forEach(err => {
        showToast(err);
      });
    }
  };

  const onClickSubscribe = () => {
    if (idx(selectedTier, x => x.tier.type) === 'FREE') {
      // if user selects free tier then dont show payment modal
      onPaymentDone();
    } else {
      setShouldShowPaymentModal(true);
    }
  };

  const closePaymentModal = () => {
    setShouldShowPaymentModal(false);
  };

  const renderFormSection = () => {
    return (
      <React.Fragment>
        <SectionHeader
          title={`Current Subscription Plan`}
          classes={{ component: classes.sectionHeading }}
        />
        <Grid container spacing={24} alignItems='center'>
          <Grid item xs={12} sm={4}>
            <TextField
              label='Subscription Plan'
              isReadOnly
              disabled
              value={idx(company, x => x.activePlan.type)}
            />
          </Grid>
        </Grid>
        {idx(company, x => x.role) === 'OWNER' && (
          <>
            <SectionHeader
              title='Available subscription plans'
              classes={{ component: classes.sectionHeading }}
            />
            <License
              {...props}
              tiersPricing={[
                {
                  pricing: 0,
                  currency: 'AUD',
                },
                {
                  pricing: 0,
                  currency: 'AUD',
                },
                {
                  pricing: 0,
                  currency: 'AUD',
                },
              ]}
              classes={{
                dropdownWrapper: classes.licenseDropdownWrapper,
                currencyDropdown: classes.licenseCurrencyDropdown,
              }}
              onTierClick={(tier, pricing, index) => {
                setSelectedPlan(index);
                setSelectedTier({
                  tier,
                  pricing,
                  index,
                });
              }}
              selectedTierIndex={selectedPlan}
            />
          </>
        )}
      </React.Fragment>
    );
  };

  return (
    <ErrorBoundary>
      <div className={classes.page}>{renderFormSection()}</div>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={isDirty ? 6 : 12}>
          <Button
            title={'Cancel'}
            onClick={() => {
              setSelectedTier({} as SelectedTierType);
              setSelectedPlan(initialSelectedPlan);
            }}
            buttonColor={theme.palette.grey['200']}
            classes={{ text: classes.cancelButtonText }}
          />
        </Grid>
        {isDirty && (
          <Grid item xs={12} sm={6}>
            <Button
              title={'Subscribe'}
              onClick={onClickSubscribe}
              buttonColor={theme.palette.primary.color2}
            />
          </Grid>
        )}
      </Grid>
      <PaymentModal
        visible={shouldShowPaymentModal}
        onClose={closePaymentModal}
        onPaymentComplete={onPaymentDone}
        selectedPlanName={idx(selectedTier, x => x.tier.type) || ''}
      />
    </ErrorBoundary>
  );
};

export default compose<IProps, IProps>(
  withStyles(styles),
  connect((state: IReduxState) => ({ company: state.profile.selectedCompany })),
  withInvoices(
    () => ({
      variables: {
        where: {
          status_in: [
            INVOICE_STATUS.FULLY_PAID,
            INVOICE_STATUS.PARTIALLY_PAID,
            INVOICE_STATUS.UNPAID,
          ],
        },
      },
    }),
    ({ data }) => {
      const invoices = get(data, 'invoices.edges', []);
      const count = get(data, 'invoices.aggregate.count');
      return {
        paidInvoices: {
          total: invoices.reduce((acc, { node }) => acc + node.total, 0),
          count,
          refetch: data.refetch,
          loading: data.loading,
        },
      };
    }
  ),
  withUpdateCompany()
)(UserDetails);
