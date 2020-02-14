export default theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  allSteps: {
    padding: '40px 20px 100px',
  },
  prevNextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  prevNextButton: {
    width: 180,
    margin: '0px 10px',
  },
  content: {
    marginTop: '30px !important',
  },
  sectionHeading: {
    marginTop: 30,
    marginBottom: 20,
  },
  form: {
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    position: 'relative',
  },
  draftButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  paymentOptions: {
    display: 'flex',
    alignItems: 'center',
  },
  paymentOption: {
    marginRight: 10,
    border: `1px solid ${theme.palette.primary.color2}`,
    borderRadius: 5,
    cursor: 'pointer',
    minWidth: 100,
    padding: 20,
    color: theme.palette.primary.color2,
    textAlign: 'center',
    '&.selected': {
      backgroundColor: theme.palette.primary.color2,
      color: 'white',
    },
  },
  attachWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  attachButton: {
    height: 52,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25,
    padding: '0px 20px',
    backgroundColor: theme.palette.primary.color2,
    marginTop: 38,
    color: 'white',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  sendInvoiceButton: {
    width: 250,
    margin: '0px 10px',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});

export const customerStepsStyle = theme => ({
  project: {
    border: `1px solid ${theme.palette.primary.color2}`,
    fontSize: 16,
    padding: '35px 15px',
    fontFamily: theme.typography.font.family2,
    textAlign: 'center',
    flex: 1,
    color: theme.palette.primary.color2,
    borderRadius: 5,
    cursor: 'pointer',
    '&.selected': {
      backgroundColor: theme.palette.primary.color2,
      color: 'white',
    },
  },
});

export const timesheetsStepsStyle = theme => ({
  customerTitle: {
    color: theme.palette.primary.color1,
    fontSize: 24,
    fontFamily: theme.typography.font.family1,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  customerAttr: {
    marginTop: 5,
    fontSize: 16,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
  },
  timesheetHeading: {
    marginTop: 30,
    marginBottom: 15,
  },
  gstLabel: {
    marginRight: 20,
    minWidth: 50,
  },
  serviceCell: {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 10px',
  },
  serviceLabel: {
    marginLeft: 10,
    fontSize: 15,
  },
  gstCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: '0px !important',
  },
  gstHeader: {
    width: '20%',
  },
  borderCell: {
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  smallTextCell: {
    fontSize: 15,
  },
  tableInputWrapper: {
    borderRadius: 0,
    border: `0px`,
    '&.is-filled': {
      backgroundColor: 'white',
    },
  },
  inputLeftIcon: {
    padding: 0,
    paddingLeft: 10,
  },
  dollarIcon: {
    fontSize: 15,
    color: '#aaa',
  },
  gstTextInput: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  inputLabel: {
    color: theme.palette.grey['400'],
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: theme.typography.font.family2,
    marginBottom: 10,
  },
  timesheetDetailsCheckbox: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
  },
  timesheetDetailsTooltip: {
    marginLeft: 15,
  },
  questionIcon: {
    color: theme.palette.grey['400'],
    fontSize: 30,
    display: 'block',
    '&:hover': {
      color: theme.palette.primary.color1,
    },
  },
  dropdownWrapper: {
    padding: [[10, 0]],
  },
  fromDatePicker: {
    marginRight: 10,
  },
});

export const reviewStyles = theme => ({
  invoiceHeader: {
    backgroundColor: theme.palette.primary.color1,
    padding: 20,
    marginTop: 10,
  },
  invoiceNumber: {
    color: theme.palette.shadow.color1,
    fontFamily: theme.typography.font.family1,
    fontSize: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  invoiceName: {
    color: 'white',
    fontSize: 30,
    marginTop: 15,
    fontFamily: theme.typography.font.family1,
  },
  invoiceDateWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  invoiceDateBlock: {},
  invoiceDateLabel: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.grey['700'],
    marginBottom: 8,
  },
  invoiceDateValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.grey['700'],
    marginBottom: 8,
  },
  invoiceDatePeriod: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.palette.grey['700'],
  },
  invoiceCustomer: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  invoiceSectionTitle: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: '500',
    marginBottom: 10,
  },
  invoiceTextValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: '300',
    marginBottom: 7,
  },
  invoiceService: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  cellHeader: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.grey['400'],
    fontWeight: 'bold',
    padding: 10,
    paddingBottom: 3,
  },
  serviceRow: {
    marginTop: '8px !important',
  },
  firstServiceRow: {
    borderTop: `1px solid ${theme.palette.grey['300']}`,
  },
  cellValueWrapper: {
    border: `1px solid ${theme.palette.grey['300']}`,
    padding: '0px !important',
    borderTop: 0,
  },
  cellValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 15,
    color: theme.palette.blueGrey['50'],
    fontWeight: '300',
    padding: '10px 20px',
  },
  greyCell: {
    color: theme.palette.grey['400'],
  },
  subtotalWrapper: {
    backgroundColor: theme.palette.grey['100'],
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `1px solid ${theme.palette.grey['300']}`,
    width: '100%',
    borderTop: 0,
  },
  subtotalText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 15,
    color: theme.palette.grey['700'],
    fontWeight: '500',
  },
  balanceDueWrapper: {
    backgroundColor: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    width: '100%',
    marginBottom: 20,
  },
  balanceDueText: {
    fontFamily: theme.typography.font.family1,
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  invoiceMessage: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  payWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  payNowSection: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
    alignSelf: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  payNowText: {
    fontFamily: theme.typography.font.family1,
    fontSize: 44,
    color: theme.palette.blueGrey['50'],
    fontWeight: 'bold',
    marginBottom: 10,
  },
  secureWrapper: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    borderLeft: 0,
    padding: 20,
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
  secureBtns: {
    display: 'flex',
    alignItems: 'center',
  },
  secureBtn: {
    marginRight: 8,
    width: 180,
  },
  invoiceNote: {
    fontFamily: theme.typography.font.family1,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: '500',
    margin: '20px 0px',
  },
});
