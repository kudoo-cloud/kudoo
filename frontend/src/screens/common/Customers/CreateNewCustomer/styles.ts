export default (theme) => ({
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
  sectionHeader: {
    padding: '20px 20px 0px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  formContainer: {
    flex: 1,
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
});
