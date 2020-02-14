export default theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

export const ActiveWorkersStyles = theme => ({
  tabContent: {
    padding: '40px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noWorkersWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '50px 0px',
  },
  noWorkerMessageWrapper: {
    width: '60%',
    maxWidth: 660,
    margin: '0px auto',
    border: `4px dashed ${theme.palette.grey[300]}`,
    padding: 10,
    borderRadius: 20,
    minHeight: 200,
    backgroundColor: theme.palette.grey[100],
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  noWorkerMessage: {
    fontFamily: theme.typography.font.family1,
    fontSize: 26,
    lineHeight: '35px',
    fontWeight: '500',
    color: theme.palette.blueGrey[50],
    textAlign: 'center',
  },
  workersContainer: {
    marginTop: '20px !important',
  },
  searchInput: {
    margin: '30px 0px',
  },
  workerNameCell: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.primary.color2,
    cursor: 'pointer',
    fontWeight: 500,
  },
  greenCell: {
    color: theme.palette.primary.color1,
    fontWeight: 'bold',
  },
  orangeCell: {
    color: theme.palette.secondary.color1,
    fontWeight: 'bold',
  },
  pagination: {
    marginTop: 20,
  },
});
