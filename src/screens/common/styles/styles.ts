export default (theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    padding: '40px 25px',
  },
  sectionHeader: {
    padding: [[40, 25, 0]],
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  form: {
    padding: [[40, 25]],
    flex: 1,
  },
  checkbox: {
    marginTop: 10,
  },
  helpIcon: {
    fontSize: 35,
    color: theme.palette.primary.color1,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpIconWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '0px !important',
    paddingBottom: '10px !important',
    paddingLeft: '10px !important',
  },
  tooltipContent: {
    padding: 10,
    maxWidth: 200,
  },
  tooltipText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  tooltipLink: {
    color: theme.palette.primary.color2,
    fontSize: 15,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});
