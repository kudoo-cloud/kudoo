import {
  Button,
  ErrorBoundary,
  WizardSteps,
  withStyles,
} from '@kudoo/components';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import isEmpty from 'lodash/isEmpty';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import omitDeep from 'omit-deep-lodash';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {
  useCreatePayrunMutation,
  useDaoMultisigsByDaoQuery,
  useGetPayrunDetailsByDaoLazyQuery,
} from 'src/generated/graphql';
import { PAYRUN_TYPE } from 'src/helpers/constants';
import { approve } from 'src/helpers/payrun/Approve';
import { pay } from 'src/helpers/payrun/Pay';
import Util from 'src/helpers/payrun/Util';
import SelectedDAO from 'src/helpers/SelectedDAO';
import { showToast } from 'src/helpers/toast';
import URL from 'src/helpers/urls';
import { useAllActions, useProfile } from 'src/store/hooks';
import Review from './Review';
import SelectInclude from './SelectInclude';
import styles from './styles';

interface IProps {
  classes: any;
  theme: any;
}

const CreateNewPayrun: React.FC<IProps> = (props) => {
  const { classes, theme } = props;

  const actions = useAllActions();
  const history = useHistory();
  const web3React = useWeb3React();

  const profile = useProfile();
  const daoId = profile?.selectedDAO?.id;

  const [activeStep, setActiveStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState([] as Array<any>);

  const [selectedIncludeData, setSelectedIncludeData] = useState({} as any);

  const [reviewData, setReviewData] = useState([] as Array<any>);
  const [payrunLoading, setPayrunLoading] = useState(false);

  const [createPayrun] = useCreatePayrunMutation();

  const [refetchData, payrun] = useGetPayrunDetailsByDaoLazyQuery({
    fetchPolicy: 'network-only',
  });

  const payrunDetails = payrun?.data?.getPayrunDetailsByDao;

  const multisig = useDaoMultisigsByDaoQuery({
    variables: {
      daoId,
    },
    skip: !daoId,
  });

  const allMultisig = (multisig?.data?.daoMultisigsByDao || []).map((item) => {
    let container = {};
    container['value'] = item?.cChainAddress;
    container['label'] = item?.name;
    return container;
  });

  useEffect(() => {
    actions.updateHeaderTitle('Payrun');
    const injected = new InjectedConnector({});
    web3React.activate(injected, undefined, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ((payrunDetails || []).length > 0) {
      setReviewData([...payrunDetails]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payrunDetails]);

  useEffect(() => {
    if (!isEmpty(selectedIncludeData)) {
      const { multisig, ...rest } = selectedIncludeData; // eslint-disable-line 
      refetchData({ variables: { data: rest } });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIncludeData]);

  const _updateSteps = (index: number) => {
    setActiveStep(index);
  };

  const _markedVisited = (index: number) => {
    let updateVisited = [...visitedSteps];
    updateVisited.push(index);
    setVisitedSteps(updateVisited);
  };

  const _unmarkedVisited = (index: number) => {
    let updateVisited = [...visitedSteps];
    updateVisited.splice(index, 1);
    setVisitedSteps(updateVisited);
  };

  const _setIncluceData = (data: any) => {
    setSelectedIncludeData({ ...data });

    _updateSteps(1);
    _markedVisited(0);
  };

  const _cancelPayrun = () => {
    const title = 'Cancel Payrun?';
    const description = (
      <div>
        <div>Are you sure you want to cancel this payrun ?</div>
        <br />
        <div>All your unsaved payrun data will be lost. </div>
      </div>
    );
    const buttons = [
      {
        title: 'Close',
        type: 'cancel',
        onClick: () => {
          actions.closeAlertDialog();
        },
      },
      {
        title: 'Cancel',
        onClick: () => {
          actions.closeAlertDialog();
          history.push(URL.PAYRUNS());
        },
      },
    ];
    const titleColor = theme.palette.primary.color2;
    actions.showAlertDialog({
      title,
      description,
      buttons,
      titleColor,
    });
  };

  const _onRemoveRow = (row) => {
    const newReviewData = [...reviewData];
    const pos = newReviewData.findIndex((obj) => obj === row);
    if (pos > -1) {
      newReviewData.splice(pos, 1);
      setReviewData(newReviewData);
    }
  };

  const _onCreatePayrun = async () => {
    try {
      if ((reviewData || []).length > 0) {
        setPayrunLoading(true);
        let suppliers = [] as any;
        let recipients = [] as any;

        reviewData.forEach((item) => {
          let container1 = {} as any;
          container1[item.name] = item.cChainAddress;
          suppliers.push(container1);

          let container2 = [] as any;
          container2.push(item.cChainAddress);
          container2.push(Util.convertFloatToString(item.amount, 18));
          recipients.push(container2);
        });

        await approve(web3React?.chainId, selectedIncludeData?.multisig);

        const checkPayrun = await pay(
          recipients,
          suppliers,
          web3React?.chainId,
          selectedIncludeData?.multisig,
        );

        if (checkPayrun) {
          let totalAmount = sumBy(reviewData, function (item: any) {
            return item?.amount;
          });

          let startsDate = '';
          let endsDate = '';

          if (
            selectedIncludeData?.payrunType === PAYRUN_TYPE.FIFTEEN_OF_MONTH
          ) {
            startsDate = moment().startOf('month').format('YYYY-MM-DD');
            endsDate = moment().date(15).format('YYYY-MM-DD');
          } else if (
            selectedIncludeData?.payrunType === PAYRUN_TYPE.FIRST_OF_MONTH
          ) {
            startsDate = moment()
              .subtract(1, 'months')
              .date(15)
              .format('YYYY-MM-DD');
            endsDate = moment()
              .subtract(1, 'months')
              .endOf('month')
              .format('YYYY-MM-DD');
          }

          const dataToSend = {
            daoId: daoId,
            totalAmount: Number(totalAmount),
            startsAt: startsDate,
            endsAt: endsDate,
            payrunDetails: omitDeep(reviewData, '__typename'),
          };

          const res = await createPayrun({
            variables: {
              data: dataToSend,
            },
          });
          if (res?.data?.createPayrun?.id) {
            setPayrunLoading(false);
            history.push(URL.PAYRUNS());
            showToast(null, 'Payrun created successfully');
          } else {
            setPayrunLoading(false);
            res?.errors?.map((err) => showToast(err.message));
          }
        } else {
          setPayrunLoading(false);
          showToast('In review should have some payee');
        }
      } else {
        setPayrunLoading(false);
        showToast('Something went wrong');
      }
    } catch (e) {
      setPayrunLoading(false);
      showToast(e.message);
      // throw new Error(e.message);
    }
  };

  const initalSteps = [
    {
      label: 'Select who to include',
      active: activeStep === 0,
      visited: visitedSteps.includes(0),
      component: (
        <SelectInclude
          setIncluceData={_setIncluceData}
          selectedIncludeData={selectedIncludeData}
          allMultisig={allMultisig}
        />
      ),
    },
    {
      label: 'Review',
      active: activeStep === 1,
      visited: visitedSteps.includes(1),
      component: (
        <Review
          updateSteps={_updateSteps}
          unmarkedVisited={_unmarkedVisited}
          loading={payrun?.loading || payrunLoading}
          removePayee={_onRemoveRow}
          data={reviewData}
          createPayrun={_onCreatePayrun}
        />
      ),
    },
  ] as Array<any>;

  return (
    <ErrorBoundary>
      <SelectedDAO
        onChange={() => {
          history.push(URL.PAYRUNS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.allSteps}>
            <WizardSteps steps={initalSteps} />
          </div>
        </div>
        <div className={classes.draftButtonWrapper}>
          <Button
            title='Cancel'
            classes={{ text: classes.cancelButtonText }}
            buttonColor='#EAEAEA'
            onClick={_cancelPayrun}
          />
        </div>
      </SelectedDAO>
    </ErrorBoundary>
  );
};

export default withStyles(styles)(CreateNewPayrun);
