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
  checkbox: {
    margin: '10px 10px',
  },
  input: {
    marginTop: 10,
    position: 'relative',
  },
  policyWrapper: {
    display: 'inline-flex',
  },
  label: {
    fontWeight: 300,
    fontSize: 16,
    color: (props) => props.labelColor || theme.palette.grey[500],
    margin: '10px 0px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    wordBreak: 'normal',
    wordWrap: 'normal',
    overflow: 'hidden',
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
