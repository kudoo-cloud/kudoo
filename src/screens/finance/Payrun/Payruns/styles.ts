export default (theme) => ({
  page: {
    padding: '40px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noServiceWrapper: {
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
  nameValueCell: {
    color: theme.palette.primary.color2,
    fontWeight: '500',
  },
  servicesContainer: {
    marginTop: '20px !important',
  },
  emailColumn: {
    width: '5%',
  },
  emailIconCell: {
    fontSize: 20,
    color: theme.palette.primary.color1,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
  },
  commonCell: {
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
});

export const ViewEntriesModalStyles = () => ({
  commonCell: {
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  modalDescription: {
    padding: '0px !important',
    width: '100%',
  },
});
