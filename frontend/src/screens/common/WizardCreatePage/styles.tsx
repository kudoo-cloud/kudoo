export default (theme: Theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  allSteps: {
    padding: '40px 20px 100px',
    flex: 1,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
});
