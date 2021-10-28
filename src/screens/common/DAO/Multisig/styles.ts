export default (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
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
  sectionHeader: {
    padding: [[20, 20]],
  },
  component: {},
  newRowButton: {
    marginTop: 20,
  },
  removeIcon: {
    padding: '0px 15px',
    cursor: 'pointer',
    color: theme.palette.blueGrey['50'],
    height: 50,
    display: 'flex',
    alignItems: 'center',
  },
});
