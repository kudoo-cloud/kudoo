const formMaxWidth = 400;

export default (theme: any) => ({
  page: {
    backgroundColor: theme.palette.primary.color3,
    padding: 45,
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
  toggleButtonWrapper: {
    maxWidth: formMaxWidth,
    width: formMaxWidth,
    margin: '25px auto',
  },
  greenTextColor: {
    color: theme.palette.primary.color1,
  },
  hideForm: {
    display: 'none',
  },
  form: {
    maxWidth: formMaxWidth,
    margin: '0px auto',
  },
  forgotPasswordText: {
    color: '#fff',
    textAlign: 'center',
    margin: '10px 0px 20px',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'none',
    display: 'block',
  },
  formErrorText: {
    color: 'red',
    margin: '10px 0px 20px 0px',
    textAlign: 'center',
    fontSize: '15px',
    fontFamily: theme.typography.font.family2,
  },
  submitBtn: {
    marginTop: '15px',
  },
  tocCheckboxWrapper: {
    margin: '20px 0px 10px',
  },
  tocCheckboxText: {
    color: 'white',
  },
  tocLink: {
    color: theme.palette.primary.color2,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  tosModalWrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    fontFamily: theme.typography.font.family2,
  },
  tosModal: {
    maxWidth: '90%',
    margin: '0px auto',
    display: 'flex',
    flexDirection: 'column',
    height: '90%',
  },
  tosModalHeader: {
    backgroundColor: '#f4f4f4',
    padding: '15px 20px',
    fontFamily: theme.typography.font.family1,
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#44536f',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& .close-icon': {
      fontSize: '30px',
      color: '#44536f',
      cursor: 'pointer',
      padding: '0px 10px',
    },
  },
  tosModalContent: {
    backgroundColor: 'white',
    padding: '20px',
    overflowY: 'auto',
    color: '#44536f',
    lineHeight: '25px',
    flex: '1',
    borderBottomLeftRadius: '5px',
    borderBottomRightRadius: '5px',
    '& p': {
      fontSize: '15px',
    },
  },
});
