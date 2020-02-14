export default theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    padding: '40px 20px',
  },
  createInvoiceBox: {
    backgroundColor: theme.palette.grey['100'],
    borderRadius: 5,
    marginTop: 40,
    padding: 30,
  },
  createInvoiceTitle: {
    fontFamily: theme.typography.font.family1,
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.palette.grey['400'],
    marginBottom: 30,
    textAlign: 'center',
  },
  ways: {
    display: 'flex',
    width: '75%',
    alignItems: 'center',
    margin: '0px auto',
    justifyContent: 'space-between',
  },
  invoiceWayWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    marginRight: 20,
    alignSelf: 'stretch',
  },
  invoiceWay: {
    backgroundColor: theme.palette.primary.color2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '100%',
    textAlign: 'center',
    height: '100%',
    padding: '30px 0px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.shadow.color2,
    },
  },
  wayIcon: {
    color: 'white',
    fontSize: 40,
    marginBottom: 15,
  },
  wayTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: theme.typography.font.family2,
    fontWeight: '500',
  },
  questionIcon: {
    color: theme.palette.grey['400'],
    fontSize: 40,
    marginTop: 15,
    '&:hover': {
      color: theme.palette.primary.color1,
    },
  },
  prevNextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  prevNextButton: {
    width: 180,
    margin: '0px 10px',
  },
});

export const detailStepStyles = theme => ({
  form: {
    marginTop: 20,
  },
  input: {
    marginTop: 10,
    position: 'relative',
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
  errorText: {
    fontWeight: 300,
    fontSize: 14,
    color: theme.palette.secondary.color1,
    marginBottom: 10,
    marginTop: 3,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    wordBreak: 'normal',
    wordWrap: 'normal',
    overflow: 'hidden',
  },
  addBankText: {
    fontWeight: 500,
    fontSize: 16,
    color: theme.palette.secondary.color1,
    fontFamily: theme.typography.font.family2,
    marginBottom: 10,
    marginTop: 3,
    display: 'flex',
    alignItems: 'center',
    '& a': {
      color: theme.palette.primary.color2,
      margin: [[0, 5]],
    },
    '& a:hover': {
      color: '#1d96c5',
      textDecoration: 'underline',
    },
  },
  paymentTextValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: '500',
    marginBottom: 7,
  },
  attachWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  dragAreaWrapper: {
    width: 'auto',
    height: 'auto',
    border: '0px',
    cursor: 'pointer',
  },
  activeDragArea: {
    backgroundColor: theme.palette.grey['100'],
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
  searchInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  attachedFilesBlock: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  attachementBlock: {
    border: `2px dashed ${theme.palette.primary.color2}`,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export const reviewStyles = theme => ({
  content: {
    marginTop: '50px !important',
  },
  sendInvoiceButton: {
    width: 200,
    margin: '0px 10px',
  },
  companyLogo: {
    width: 250,
    height: 88,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: theme.palette.shadow.color1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    color: 'white',
    fontSize: 40,
  },
  invoiceTitleRightPart: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
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
  gstLabel: {
    marginRight: 20,
  },
  gstCell: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gstStatus: {
    fontSize: 13,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.grey['400'],
  },
  gstHeaderCell: {
    width: '13%',
    padding: [[0, 10]],
  },
  smallTextCell: {
    fontSize: 14,
    padding: [[0, 10]],
  },
  bigWidthCell: {
    width: '80%',
    padding: [[0, 10]],
  },
  smallWidthCell: {
    width: '7%',
    padding: [[0, 10]],
  },
  mediumWidthCell: {
    width: '20%',
    padding: [[0, 10]],
  },
  borderCell: {
    paddingLeft: 10,
    paddingRight: 10,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  subtotalWrapper: {
    backgroundColor: theme.palette.grey['100'],
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
  },
  subtotalText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.grey['700'],
    fontWeight: '300',
  },
  balanceDueWrapper: {
    backgroundColor: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
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
  invoiceAttachments: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  invoiceAttachedFiles: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
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

export const sendInvoiceModalStyles = theme => ({
  emailInputs: {
    marginTop: 15,
  },
});