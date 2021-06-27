export default (theme) => ({
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
    marginTop: '50px !important',
  },
  formHeading: {
    marginTop: 40,
  },
  form: {
    marginTop: 20,
  },
  halfFieldWRow: {
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
    position: 'relative',
  },
  leftInput: {
    marginRight: 10,
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchIcon: {
    backgroundColor: theme.palette.primary.color1,
    padding: '16px 25px',
    color: 'white',
    fontSize: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  checkbox: {
    margin: '10px 0px',
  },
  serviceInputWrapper: {
    margin: '30px 10px',
  },
  serviceTabelHeader: {
    width: '50%',
  },
  gstTabelHeader: {
    width: '20%',
  },
  tableInputCell: {
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 25,
  },
  smallInputComponent: {},
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
  inputLabel: {
    color: theme.palette.grey['400'],
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: theme.typography.font.family2,
    marginBottom: 10,
  },
  addServiceButton: {
    marginTop: 20,
  },
  totalWrapper: {
    backgroundColor: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginTop: 20,
  },
  totalLabel: {
    fontFamily: theme.typography.font.family1,
    fontSize: 32,
    color: 'white',
  },
  totalValue: {
    fontFamily: theme.typography.font.family1,
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
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
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});

export const reviewStyles = (theme) => ({
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

export const ServiceInputRowStyles = (theme) => ({
  fieldCell: {
    border: `1px solid ${theme.palette.grey['300']}`,
    padding: '0px !important',
  },
  textInputWrapper: {
    border: 0,
    borderRadius: 0,
  },
  textInput: {
    fontSize: 17,
  },
  leftIcon: {
    marginRight: 5,
  },
  dollarSign: {
    color: theme.palette.grey['300'],
    fontSize: 19,
    fontFamily: theme.typography.font.family2,
  },
  gstInput: {
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
  },
});
