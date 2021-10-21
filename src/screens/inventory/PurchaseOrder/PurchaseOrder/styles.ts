export type StyleKeys =
  | 'page'
  | 'wizardComponent'
  | 'includeCheckboxWrapper'
  | 'sectionHeading'
  | 'form'
  | 'formFields'
  | 'formHeading'
  | 'prevNextWrapper'
  | 'prevNextButton'
  | 'cancelButtonText'
  | 'tableInputCell'
  | 'tableInputWrapper';

export default (theme: Theme): StyleFnReturnType<StyleKeys> => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // padding: '20px 0 0 0',
  },
  wizardComponent: {
    padding: '20px 0 0 0',
  },
  includeCheckboxWrapper: {
    marginTop: 10,
  },
  sectionHeading: {
    padding: '20px',
    minHeight: '42px',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  formFields: {
    flex: 1,
    padding: '20px',
    paddingBottom: 20,
    minHeight: 'calc(100vh - 364px)',
  },
  formHeading: {
    marginTop: 35,
    marginBottom: 15,
  },
  prevNextWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prevNextButton: {
    width: 230,
    margin: '0px 10px',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  tableInputCell: {
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  tableInputWrapper: {
    borderRadius: 0,
    border: `0px`,
    '&.is-filled': {
      backgroundColor: 'white',
    },
  },
});

export type CreateStyleKeys =
  | 'addRowButton'
  | 'rowTableHeader'
  | 'pDropDown'
  | 'pDropdownSelect'
  | 'purchaseOrderLineTable'
  | 'root'
  | 'input'
  | 'valueContainer'
  | 'noOptionsMessage'
  | 'singleValue'
  | 'placeholder'
  | 'paper'
  | 'detailCard'
  | 'detailCardHeader'
  | 'detailCardContent'
  | 'keyDiv'
  | 'valueDiv'
  | 'editButton'
  | 'errorLabel';

export const createPurchaseOrderStyles = (
  theme: Theme,
): StyleFnReturnType<CreateStyleKeys> => ({
  addRowButton: {
    marginTop: 20,
  },
  rowTableHeader: {},
  pDropDown: {
    minWidth: 200,
  },
  pDropdownSelect: {
    borderRadius: 0,
    border: 0,
  },
  purchaseOrderLineTable: {
    padding: '7px 20px 0 20px',
    minHeight: 'calc(100vh - 371px)',
  },
  root: {
    flexGrow: 1,
    height: 250,
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  noOptionsMessage: {
    padding: '10px',
  },
  singleValue: {
    fontSize: 16,
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: '10px',
    left: 0,
    right: 0,
  },
  detailCard: {
    alignSelf: 'stretch',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.font.family2,
    position: 'relative',
    color: theme.palette.blueGrey['50'],
  },
  detailCardHeader: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    padding: '0px 20px',
    color: 'white',
    fontWeight: 'bold',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    '&.green': {
      backgroundColor: theme.palette.primary.color1,
    },
    '&.h1': {
      fontSize: 16,
    },
    '&.h2': {
      fontSize: 10,
    },
    '&.blue': {
      backgroundColor: theme.palette.primary.color2,
    },
    '&.black': {
      backgroundColor: theme.palette.primary.color3,
    },
  },
  detailCardContent: {
    padding: '10px 20px',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    border: `1px solid ${theme.palette.grey['200']}`,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    '&.withBG': {
      backgroundColor: theme.palette.grey['100'],
      border: 0,
    },
    '&.h1': {
      fontSize: 20,
    },
    '&.h2': {
      fontSize: 16,
    },
  },
  keyDiv: {
    marginBottom: 5,
    textAlign: 'left',
  },
  valueDiv: {
    textAlign: 'right',
    marginBottom: 5,
    marginRight: 15,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 20,
    cursor: 'pointer',
  },
  errorLabel: {
    color: '#f4a22a',
    overflow: 'hidden',
    fontSize: '16px',
    wordWrap: 'normal',
    marginTop: '15px',
    wordBreak: 'normal',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    marginBottom: '10px',
    textOverflow: 'ellipsis',
    float: 'right',
  },
});

export type POStyleKeys =
  | 'content'
  | 'noWrapper'
  | 'noMessageWrapper'
  | 'noMessage'
  | 'borderCell'
  | 'balanceCell'
  | 'purchaseOrderLink'
  | 'dollarIcon'
  | 'iconsWrapper';

export const purchaseOrderStyles = (
  theme: Theme,
): StyleFnReturnType<POStyleKeys> => ({
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 20px',
  },
  noWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '50px 0px',
  },
  noMessageWrapper: {
    width: '60%',
    maxWidth: 660,
    margin: '0px auto',
    border: `4px dashed ${theme.palette.grey[300]}`,
    padding: 10,
    borderRadius: 20,
    minHeight: 200,
    backgroundColor: theme.palette.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    cursor: 'pointer',
  },
  noMessage: {
    fontFamily: theme.typography.font.family1,
    fontSize: 26,
    lineHeight: '35px',
    fontWeight: 500,
    color: theme.palette.blueGrey[50],
    textAlign: 'center',
  },
  borderCell: {
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  balanceCell: {
    justifyContent: 'space-between',
  },
  purchaseOrderLink: {
    color: theme.palette.primary.color2,
    fontWeight: 500,
  },
  dollarIcon: {
    color: theme.palette.shadow.color3,
    border: `2px solid ${theme.palette.shadow.color3}`,
    width: 15,
    height: 15,
    borderRadius: '50%',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.color1,
      color: 'white',
      border: `2px solid ${theme.palette.primary.color1}`,
    },
  },
  iconsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export type ReviewStyleKeys =
  | 'content'
  | 'pbsContent'
  | 'daoLogo'
  | 'purchaseOrderTitleRightPart'
  | 'purchaseOrderHeader'
  | 'purchaseOrderName'
  | 'purchaseOrderDateWrapper'
  | 'purchaseOrderDateBlock'
  | 'purchaseOrderDateLabel'
  | 'purchaseOrderDateValue'
  | 'purchaseOrderDatePeriod'
  | 'purchaseOrderCustomer'
  | 'purchaseOrderSectionTitle'
  | 'purchaseOrderTextValue'
  | 'purchaseOrderService'
  | 'smallTextCell'
  | 'bigWidthCell'
  | 'smallWidthCell'
  | 'mediumWidthCell'
  | 'borderCell'
  | 'subtotalWrapper'
  | 'subtotalText'
  | 'balanceDueWrapper'
  | 'balanceDueText'
  | 'purchaseOrderMessage'
  | 'purchaseOrderAttachments'
  | 'purchaseOrderAttachedFiles'
  | 'payWrapper'
  | 'payNowSection'
  | 'payNowText'
  | 'secureWrapper'
  | 'secureBtns'
  | 'secureBtn'
  | 'purchaseOrderNote'
  | 'customExpansion'
  | 'pbsPage'
  | 'detailBox'
  | 'expSecondHeader'
  | 'expHeader';

export const reviewStyles = (
  theme: Theme,
): StyleFnReturnType<ReviewStyleKeys> => ({
  content: {
    padding: '35px',
  },
  pbsContent: {
    width: '100%',
  },
  daoLogo: {
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
  purchaseOrderTitleRightPart: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  purchaseOrderHeader: {
    backgroundColor: theme.palette.primary.color1,
    padding: 20,
    marginTop: 10,
  },
  purchaseOrderName: {
    color: 'white',
    fontSize: 30,
    marginTop: 15,
    fontFamily: theme.typography.font.family1,
  },
  purchaseOrderDateWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  purchaseOrderDateBlock: {},
  purchaseOrderDateLabel: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.grey['700'],
    marginBottom: 8,
  },
  purchaseOrderDateValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.grey['700'],
    marginBottom: 8,
  },
  purchaseOrderDatePeriod: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontStyle: 'italic',
    color: theme.palette.grey['700'],
  },
  purchaseOrderCustomer: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  purchaseOrderSectionTitle: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: 500,
    marginBottom: 10,
  },
  purchaseOrderTextValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: 300,
    marginBottom: 7,
  },
  purchaseOrderService: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  smallTextCell: {
    fontSize: 14,
    padding: '0px 10px',
  },
  bigWidthCell: {
    width: '80%',
    padding: '0px 10px',
  },
  smallWidthCell: {
    width: '7%',
    padding: '0px 10px',
  },
  mediumWidthCell: {
    width: '20%',
    padding: '0px 10px',
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
    fontWeight: 300,
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
  purchaseOrderMessage: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  purchaseOrderAttachments: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
    padding: 20,
  },
  purchaseOrderAttachedFiles: {
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
  purchaseOrderNote: {
    fontFamily: theme.typography.font.family1,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    fontWeight: 500,
    margin: '20px 0px',
  },
  customExpansion: {
    backgroundColor: '#3c4556',
    color: 'white',
  },
  pbsPage: {
    minHeight: 'calc(100vh - 285px)',
  },
  detailBox: {
    flexDirection: 'column',
    padding: '20px',
  },
  expSecondHeader: {
    color: '#8a8686',
  },
  expHeader: {
    flexBasis: '72.68%',
    flexShrink: 0,
  },
});
