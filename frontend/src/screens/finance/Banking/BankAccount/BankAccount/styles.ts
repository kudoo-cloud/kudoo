export default theme => ({
  page: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10,
  },
  imageSize: {
    height: 'calc(100vh - 155px)',
    width: 'calc(100vw - 285px)',
  },
});

export const BankStyles = theme => ({
  page: {
    padding: '40px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noLedgerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '50px 0px',
  },
  noActiveMessageWrapper: {
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
  },
  noActiveMessage: {
    fontFamily: theme.typography.font.family1,
    fontSize: 26,
    lineHeight: '35px',
    fontWeight: '500',
    color: theme.palette.blueGrey[50],
    textAlign: 'center',
  },
  mainAccountNameCell: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.primary.color2,
    cursor: 'pointer',
    fontWeight: 500,
  },
  ledgerContainer: {
    marginTop: '20px !important',
  },
});
