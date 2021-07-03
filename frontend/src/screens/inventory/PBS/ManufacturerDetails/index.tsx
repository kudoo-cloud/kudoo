import { ToggleButton, withStyles } from '@kudoo/components';
import Grid from '@material-ui/core/Grid';
import cx from 'classnames';
import get from 'lodash/get';
import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import SelectedDAO from 'src/helpers/SelectedDAO';
import URL from 'src/helpers/urls';
import DetailsTab from './DetailsTab';
import InvoicesTab from './InvoicesTab';
import styles from './styles';

interface IProps {
  actions: any;
  customer: any;
  updateCustomer: any;
  profile: any;
  invoices: any;
  i18n: any;
  classes: any;
  history: any;
  theme: any;
  pbsOrganisation: any;
}
interface IState {
  activeSection: number;
}

class ManufacturerDetails extends Component<IProps, IState> {
  public static defaultProps = {
    pbsOrganisation: {
      refetch: () => {},
      loadNextPage: () => {},
      data: {},
    },
  };

  public customerBasicInfoForm: any;
  public customerAddressContactForm: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      activeSection: 0,
    };
  }

  public componentDidMount() {
    this.props.actions.updateHeaderTitle('Manufacturer');
  }

  public _getCustomerDetails = () => {
    const { customer } = this.props;
    const customerData = get(customer, 'data', {});
    const contact = get(customerData, 'contacts[0]') || {};
    const address = get(customerData, 'addresses[0]') || {};
    return {
      id: customerData.id,
      name: get(customerData, 'name', ''),
      govNumber: String(get(customerData, 'govNumber', '')),
      contact,
      address,
    };
  };

  public _getTotalAmountMade = () => {
    const { invoices } = this.props;
    const invoicesRow = get(invoices, 'data', []);
    const totalMade = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status === 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalMade;
  };

  public _getTotalOwed = () => {
    const { invoices } = this.props;
    const invoicesRow = get(invoices, 'data', []);
    const totalOwed = invoicesRow.reduce((acc, invoice) => {
      if (invoice.status !== 'FULLY_PAID') {
        return acc + invoice.total;
      }
      return acc;
    }, 0);
    return totalOwed;
  };

  public _renderDetailsCards() {
    const { classes, pbsOrganisation } = this.props;
    return (
      <div className={classes.detailsCardsWrapper}>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={5}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'green h1')}>
                {get(pbsOrganisation, 'data.title')}
              </div>
              <div className={cx(classes.detailCardContent, 'withBG h2')}>
                <div className={classes.keyValue}>
                  Code {get(pbsOrganisation, 'data.code')}
                </div>
                <div className={classes.keyValue}>
                  Phone {get(pbsOrganisation, 'data.phone')}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={2} />
          <Grid item xs={12} sm={3}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'black h2')}>
                Total outstanding Purchase orders
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>0</div>
            </div>
          </Grid>
          <Grid item xs={12} sm={2}>
            <div className={classes.detailCard}>
              <div className={cx(classes.detailCardHeader, 'black h2')}>
                Owed
              </div>
              <div className={cx(classes.detailCardContent, 'h1')}>0</div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }

  public _renderToggleButton() {
    const { theme } = this.props;
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} sm={6}>
          <ToggleButton
            labels={['Details', 'Invoices', 'Purchase Orders']}
            selectedIndex={0}
            activeColor={theme.palette.primary.color1}
            onChange={(label, index) => {
              this.setState({ activeSection: index });
            }}
          />
        </Grid>
      </Grid>
    );
  }

  public _renderDetailsSection() {
    const { pbsOrganisation } = this.props;
    return (
      <DetailsTab data={get(pbsOrganisation, 'data', {})} onSubmit={() => {}} />
    );
  }

  public _renderInvoiceSection() {
    return <InvoicesTab invoices={[]} />;
  }

  public render() {
    const { classes } = this.props;
    return (
      <SelectedDAO
        onChange={() => {
          this.props.history.push(URL.MANUFACTURERS());
        }}
      >
        <div className={classes.page}>
          <div className={classes.content}>
            {this._renderDetailsCards()}
            {this._renderToggleButton()}
            {this.state.activeSection === 0 && this._renderDetailsSection()}
            {this.state.activeSection === 1 && this._renderInvoiceSection()}
          </div>
        </div>
      </SelectedDAO>
    );
  }
}

export default compose(
  withStyles(styles),
  connect((state: any) => ({
    profile: state.profile,
  })),
  // withPBSOrganisation((props) => ({
  //   id: get(props, 'match.params.id'),
  // })),
)(ManufacturerDetails);
