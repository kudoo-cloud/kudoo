export default (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  allSteps: {
    padding: '40px 20px 100px',
  },
  prevNextWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  prevNextButton: {
    width: 180,
    margin: '0px 10px',
  },
  content: {
    marginTop: '50px !important',
  },
  form: {
    marginTop: 20,
  },
  checkbox: {
    margin: '10px 0px',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});
