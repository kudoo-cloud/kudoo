export default () => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
});

export const ActiveTimesheetsStyles = (theme) => ({
  page: {
    padding: '40px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noTimesheetsWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    margin: '50px 0px',
    cursor: 'pointer',
  },
  noTimesheetsMessageWrapper: {
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
  noTimesheetsMessage: {
    fontFamily: theme.typography.font.family1,
    fontSize: 26,
    lineHeight: '35px',
    fontWeight: '500',
    color: theme.palette.blueGrey[50],
    textAlign: 'center',
  },
  dropdownWrapper: {
    marginTop: 20,
    marginBottom: 20,
  },
  timesheetsContainer: {
    marginTop: '20px !important',
  },
  timesheet: {
    marginBottom: 30,
  },
  expandHideWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  expandHideLabel: {
    fontSize: 15,
    color: theme.palette.grey['300'],
    fontFamily: theme.typography.font.family2,
    cursor: 'default',
    pointerEvents: 'none',
    '&.active': {
      color: theme.palette.blueGrey['50'],
      cursor: 'pointer',
      pointerEvents: 'initial',
    },
  },
  slash: {
    fontSize: 15,
    color: theme.palette.grey['300'],
    fontFamily: theme.typography.font.family2,
    margin: '0px 5px',
  },
});

export const timesheetBlockStyles = (theme) => ({
  wrapper: {},
  titleWrapper: {
    padding: 20,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.primary.color1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    cursor: 'pointer',
    '&.is-company': {
      backgroundColor: theme.palette.primary.color3,
    },
    '&.is-collapsed': {
      borderRadius: 5,
    },
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: theme.typography.font.family1,
    flex: 1,
  },
  type: {
    fontSize: 24,
    color: theme.palette.shadow.color1,
    fontWeight: 'bold',
    fontFamily: theme.typography.font.family1,
    paddingRight: 20,
  },
  arrowIcon: {
    color: 'white',
    fontSize: 25,
    marginRight: 10,
    transition: 'all 0.2s ease-in',
    transform: 'rotate(0deg)',
    '&.is-open': {
      transform: 'rotate(90deg)',
    },
  },
  serviceInfoWrapper: {
    backgroundColor: theme.palette.grey['200'],
    padding: '15px 20px',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  serviceName: {
    fontSize: 16,
    color: theme.palette.grey['500'],
    fontWeight: '500',
    fontFamily: theme.typography.font.family2,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    color: theme.palette.grey['400'],
    fontWeight: '500',
    fontFamily: theme.typography.font.family2,
  },
  statusCell: {
    paddingLeft: 24,
    paddingRight: 24,
    fontWeight: 'bold',
    '&.orange': {
      color: theme.palette.secondary.color1,
    },
    '&.green': {
      color: theme.palette.primary.color1,
    },
  },
  emailColumn: {
    width: '5%',
  },
  emailIconCell: {
    fontSize: 20,
    color: theme.palette.primary.color1,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
  },
  tableRowRoot: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
    },
  },
});

export const TimesheetNotificationModalStyles = () => ({
  emailInputs: {
    marginTop: 15,
  },
});

export const ViewEntriesModalStyles = () => ({
  commonCell: {
    paddingLeft: 24,
    paddingRight: 24,
    minHeight: 50,
    display: 'flex',
    alignItems: 'center',
  },
  modalDescription: {
    padding: '0px !important',
    width: '100%',
  },
});
