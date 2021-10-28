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
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  formFields: {
    flex: 1,
    padding: [[0, 20]],
    paddingBottom: 20,
  },
  formHeading: {
    marginTop: 35,
    marginBottom: 15,
  },
  gstCheckbox: {
    paddingTop: 25,
    marginTop: 12,
    marginLeft: 10,
  },

  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  primaryContactCheck: {
    marginTop: 10,
  },
  sectionHeader: {
    padding: [[20, 20]],
  },
  component: {},
  inputLeftIcon: {
    padding: 0,
    paddingLeft: 10,
  },
  dollarIcon: {
    fontSize: 15,
    color: '#aaa',
  },
});
