export default theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  sectionHeader: {
    padding: '20px 25px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  formFields: {
    padding: '0px 25px',
    flex: 1,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});
