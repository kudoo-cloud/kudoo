const formMaxWidth = 400;

export default (theme) => ({
  page: {
    display: 'flex',
    flex: 1,
    width: '100%',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.palette.primary.color3,
    fontFamily: theme.typography.font.family2,
  },
  title: {
    color: 'white',
    margin: '10px 0px',
    fontFamily: theme.typography.font.family1,
    fontSize: '32px',
    fontWeight: 500,
    textAlign: 'center',
  },
  form: {
    maxWidth: formMaxWidth,
    margin: '0px auto',
  },
  formErrorText: {
    color: 'red',
    margin: '10px 0px 20px 0px',
    textAlign: 'center',
    fontSize: '15px',
    fontFamily: theme.typography.font.family2,
  },
  greenTextColor: {
    color: theme.palette.primary.color1,
  },
  submitBtn: {
    marginTop: '15px',
  },
  letterImage: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    backgroundColor: (props) =>
      props.borderColor || theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontFamily: theme.typography.font.family2,
    fontWeight: 500,
    color: 'white',
    marginRight: 10,
  },
});
