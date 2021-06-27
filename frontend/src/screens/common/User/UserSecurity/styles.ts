export default (theme) => ({
  page: {
    padding: '0px 20px 20px',
  },
  sectionHeading: {
    marginTop: 40,
  },
  formWrapper: {
    marginTop: 20,
  },
  fieldRow: {
    marginTop: 20,
    position: 'relative',
  },
  halfFieldWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  leftInput: {
    marginRight: 10,
  },
  fieldSideText: {
    fontFamily: "'montserrat', sans-serif",
    fontSize: 14,
    color: '#B7B7B7',
    position: 'absolute',
    bottom: 20,
    right: -220,
    minWidth: 200,
  },
  form: {
    width: '100%',
    minWidth: 600,
  },
  formFields: {
    width: '90%',
    padding: '20px 5%',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  updatePwdModalDescription: {
    padding: 0,
  },
});
