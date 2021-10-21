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
  prevNextButton: {
    width: 180,
    margin: '0px 10px',
  },
  prevNextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },

  serviceCell: {
    display: 'flex',
    alignItems: 'center',
    padding: '0px 10px',
  },
  tableInputWrapper: {
    borderRadius: 0,
    backgroundColor: 'white',
  },
  gstTextInput: {
    paddingLeft: 5,
    paddingRight: 5,
  },
});
