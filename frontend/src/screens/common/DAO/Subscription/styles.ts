export type StylesKeys =
  | 'page'
  | 'sectionHeading'
  | 'subscriptionWrapper'
  | 'container'
  | 'planExpiredWarning'
  | 'licenseDropdownWrapper'
  | 'licenseCurrencyDropdown'
  | 'cancelButtonText'
  | 'paymentModalInner'
  | 'paymentModalDesc'
  | 'paymentFormElement'
  | 'paymentFormElementError'
  | 'paymentFormError'
  | 'paymentPayButton';

export default (theme: Theme): StyleFnReturnType<StylesKeys> => ({
  page: {
    padding: '0px 20px 20px',
    flex: 1,
  },
  sectionHeading: {
    marginTop: 40,
    marginBottom: 15,
  },
  subscriptionWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    marginTop: '0px !important',
  },
  planExpiredWarning: {
    color: theme.palette.secondary.color1,
    fontSize: 14,
    marginTop: 10,
  },
  licenseDropdownWrapper: {
    textAlign: 'left',
  },
  licenseCurrencyDropdown: {
    margin: 0,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  paymentModalInner: {
    minWidth: 500,
  },
  paymentModalDesc: {
    padding: 30,
  },
  paymentFormElement: {
    padding: 10,
    border: `2px solid ${theme.palette.primary.color2}`,
    borderRadius: 5,
    transition: 'all 150ms ease',
  },
  paymentFormElementError: {
    borderColor: theme.palette.secondary.color2,
  },
  paymentFormError: {
    fontSize: 15,
    color: theme.palette.secondary.color2,
    marginTop: 10,
  },
  paymentPayButton: {
    marginTop: 10,
    borderRadius: 5,
  },
});
