export default (theme: any) => ({
  page: {
    backgroundColor: theme.palette.grey['50'],
    padding: 45,
    fontFamily: theme.typography.font.family2,
  },
  middleContainer: {
    maxWidth: 400,
    margin: '0px auto',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  mailSentIcon: {
    width: '100px',
    height: '100px',
    margin: '30px 0px 25px 0px',
  },
  form: {
    minWidth: 350,
  },
  submitBtn: {
    marginTop: 15,
  },
  messageWrapper: {
    lineHeight: '24px',
  },
  messageTitle: {
    textAlign: 'center',
    color: theme.palette.secondary.color1,
    fontWeight: 500,
    marginBottom: 10,
    fontSize: 16,
  },
  messageDesc: {
    textAlign: 'center',
    color: '#a8a8a8',
    marginBottom: '20px',
    fontSize: '15px',
  },
});
