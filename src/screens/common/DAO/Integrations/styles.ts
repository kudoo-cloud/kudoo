export default (theme) => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    // padding: '40px 25px',
  },
  borderCell: {
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  integrationImage: {
    display: 'flex',
  },
});
