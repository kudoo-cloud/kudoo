export default theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: '40px 20px',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  formFields: {
    flex: 1,
    padding: [[0, 20]],
    paddingBottom: 20,
  },
  formHeading: {
    marginTop: 35,
    marginBottom: 15,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  primaryContactCheck: {
    marginTop: 10,
  },
  sectionHeader: {
    padding: [[20, 20]],
  },
  component: {},
  salesOrderWizardPage: {
    flex: 1,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    paddingTop: '30px',
  },
  salesOrderLineTabelHeader: {
    width: '50%',
  },
  tableInputCell: {
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 0,
    paddingRight: 25,
  },
  tableInputWrapper: {
    borderRadius: 0,
    border: `0px`,
    '&.is-filled': {
      backgroundColor: 'white',
    },
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
  mainDivSalesOrder: {
    height: 'calc(100vh - 474px)',
    overflowY: 'hidden',
    padding: '10px 20px 10px 20px',
  },
  mainDivSalesOrderLine: {
    height: 'calc(100vh - 454px)',
    overflowY: 'auto',
    padding: '10px 20px 10px 20px',
  },
  addRowButton: {
    marginTop: 20,
  },
  rowTabelHeader: {
    width: '50%',
  },
});
