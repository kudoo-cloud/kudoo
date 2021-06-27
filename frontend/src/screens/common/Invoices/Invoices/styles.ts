export default () => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  includeCheckboxWrapper: {
    marginTop: 10,
  },
});

export const UnpaidInvoicesTabStyles = (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 20px',
  },
  noInvoicesWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '50px 0px',
  },
  noInvoicesMessageWrapper: {
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
  noInvoiceMessage: {
    fontFamily: theme.typography.font.family1,
    fontSize: 26,
    lineHeight: '35px',
    fontWeight: '500',
    color: theme.palette.blueGrey[50],
    textAlign: 'center',
  },
  invoicesContainer: {
    marginTop: '20px !important',
  },
  borderCell: {
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  balanceCell: {
    justifyContent: 'space-between',
  },
  invoiceLink: {
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
    fontWeight: '500',
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
