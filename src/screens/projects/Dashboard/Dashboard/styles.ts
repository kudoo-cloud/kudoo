export default (theme) => ({
  page: {
    // padding: 40,
  },
  headerBar: {
    backgroundColor: theme.palette.grey[100],
    height: 50,
    display: 'flex',
    alignItems: 'center',
  },
  refreshButton: {
    padding: [[0, 10]],
    backgroundColor: theme.palette.primary.color2,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    fontSize: 20,
    height: '100%',
  },
  lastRefreshText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 14,
    color: '#c4c4c4',
    fontWeight: 300,
    margin: [[0, 15]],
    flex: 1,
  },
  periodButtons: {
    display: 'flex',
    alignItems: 'center',
    marginRight: 15,
  },
  periodButton: {
    backgroundColor: theme.palette.grey['200'],
    padding: [[10, 15]],
    borderRadius: 25,
    marginLeft: 15,
    fontSize: 16,
    fontWeight: 500,
    fontFamily: theme.typography.font.family2,
    width: 100,
    color: '#c4c4c4',
    '&.active': {
      backgroundColor: theme.palette.primary.color1,
      color: '#fff',
    },
  },
  dateInput: {
    backgroundColor: 'white',
    borderRadius: 0,
    border: '0px solid',
    width: 150,
    '&.is-filled': {
      backgroundColor: 'white',
    },
  },
  calendarBtn: {
    backgroundColor: 'white',
    color: theme.palette.primary.color1,
  },
  blockWrapper: {
    position: 'relative',
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '&.n-m-left': {
      marginLeft: 0,
    },
    '&.n-m-right': {
      marginRight: 0,
    },
    '&.n-m-top': {
      marginTop: 0,
    },
  },
  blockTitle: {
    backgroundColor: theme.palette.primary.color3,
    padding: [[15, 20]],
    fontFamily: theme.typography.font.family1,
    fontSize: 16,
    fontWeight: 700,
    color: 'white',
    border: `1px solid ${theme.palette.grey['200']}`,
    borderBottom: `0px solid`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockContent: {
    border: `1px solid ${theme.palette.grey['200']}`,
    borderTop: `0px solid`,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey['100'],
  },
  widgetItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  rowCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  widgets: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10,
  },
});

export const ProfileStatsStyles = (theme) => ({
  comingSoonBlock: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.primary.color1,
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 50,
  },
  profileStatusBlock: {
    padding: 20,
    filter: 'blur(4px)',
  },
  progressBar: {
    marginBottom: 10,
  },
  progressBarLabel: {
    width: 150,
  },
  circularProgressWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  circularProgressPercent: {
    color: theme.palette.secondary.color1,
    fontFamily: theme.typography.font.family2,
    fontSize: 32,
    fontWeight: 'bold',
  },
  circularProgressStatus: {
    color: '#C4C4C4',
    fontFamily: theme.typography.font.family2,
    fontSize: 14,
  },
  circularProgressMsg: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: '300',
    color: theme.palette.grey['700'],
    marginLeft: 10,
    lineHeight: '25px',
  },
});

export const RevenueStyles = (theme) => ({
  revenueStatsBlock: {
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  revenueStatsWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  revenueStatsItem: {},
  revenueTotalLabel: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 300,
    color: theme.palette.blueGrey['50'],
  },
  revenueTotalValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 20,
    fontWeight: 500,
    color: theme.palette.primary.color1,
    marginTop: 5,
  },
  declinedByLabel: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 300,
    color: theme.palette.secondary.color2,
  },
  declinedByValue: {
    fontFamily: theme.typography.font.family2,
    fontSize: 12,
    fontWeight: 300,
    color: '#c4c4c4',
    textAlign: 'right',
    marginTop: 5,
  },
  revenueChart: {
    marginTop: 20,
    height: 200,
    fontFamily: theme.typography.font.family2,
  },
  chartTooltip: {
    padding: 5,
    color: 'white',
  },
  chartTooltipText: {
    color: 'white',
  },
  revenueChartXBlock: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  revenueChartXRight: {
    marginRight: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  revenueChartXLabel: {
    height: 30,
    display: 'flex',
    alignItems: 'center',
  },
  revenueChartXLeft: {
    flex: 1,
    position: 'relative',
  },
  revenueChartXBar: {
    height: 30,
    backgroundColor: 'white',
    borderBottom: `1px solid ${theme.palette.grey['200']}`,
  },
  revenueChartYTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  revenueYBar: {
    position: 'absolute',
    bottom: '68px',
    transform: 'rotate(-90deg)',
    left: '-67px',
  },
});

export const AverageStatsStyles = (theme) => ({
  avgSalesBlock: {
    backgroundColor: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    padding: 18,
    flex: 1,
    justifyContent: 'center',
  },
  avgSalesAmount: {
    fontFamily: theme.typography.font.family2,
    fontSize: 32,
    fontWeight: 300,
    color: 'white',
  },
  avgSalesText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 14,
    fontWeight: 300,
    color: theme.palette.shadow.color1,
    marginTop: 5,
  },
  avgValBlock: {
    backgroundColor: theme.palette.grey['100'],
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 15,
    flex: 1,
  },
  avgValAmount: {
    fontFamily: theme.typography.font.family2,
    fontSize: 32,
    fontWeight: 300,
    color: theme.palette.blueGrey['50'],
  },
  avgValText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 14,
    fontWeight: 300,
    color: '#c4c4c4',
    marginTop: 5,
  },
});

export const InvoiceStyles = (theme) => ({
  invoiceBlock: {
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  invoiceBlockItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  invoiceAmount: {
    padding: 35,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.typography.font.family2,
    color: 'white',
    fontWeight: 500,
    '$invoiceBlockItem.green &': {
      backgroundColor: theme.palette.primary.color1,
    },
    '$invoiceBlockItem.orange &': {
      backgroundColor: theme.palette.secondary.color1,
    },
  },
  invoiceNumber: {
    padding: 5,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: theme.typography.font.family2,
    color: 'white',
    fontWeight: 300,
    '$invoiceBlockItem.green &': {
      backgroundColor: theme.palette.shadow.color1,
    },
    '$invoiceBlockItem.orange &': {
      backgroundColor: '#D98F21',
    },
  },
  invoiceTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
    fontWeight: 500,
    marginTop: 15,
  },
});

export const MostRecentBlockStyles = (theme) => ({
  component: {
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  list: {
    border: `1px solid ${theme.palette.grey['300']}`,
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderBottom: `1px solid ${theme.palette.grey['300']}`,
    '&:last-child': {
      borderBottom: `0px solid`,
    },
  },
  noRecentItem: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: '0px',
  },
  listItemPrimary: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    fontWeight: 300,
  },
  listItemSecondary: {
    fontFamily: theme.typography.font.family2,
    color: '#c4c4c4',
    fontSize: 16,
    fontWeight: 300,
  },
});

export const LatestActivityStyles = (theme) => ({
  component: {},
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey['200'],
    height: 50,
    width: '100%',
  },
  title: {
    flex: 1,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    fontWeight: 300,
    padding: [[10, 20]],
  },
  icon: {
    height: 50,
    width: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25,
    color: theme.palette.primary.color2,
    backgroundColor: theme.palette.grey['300'],
  },
  content: {
    backgroundColor: theme.palette.grey['100'],
    height: '100vh',
    overflow: 'auto',
  },
});

export const LatestActivityItemStyles = (theme) => ({
  component: {
    display: 'flex',
    alignItems: 'center',
    padding: [[0, 20]],
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
  },
  bar: {
    backgroundColor: theme.palette.grey['300'],
    height: 30,
  },
  topBar: {
    width: (props: any) => (props.topBar ? 2 : 0),
  },
  bottomBar: {
    width: (props: any) => (props.bottomBar ? 2 : 0),
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.primary.color1}`,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.color1,
  },
  label: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.grey['700'],
    fontSize: 16,
    fontWeight: 500,
  },
  time: {
    fontFamily: theme.typography.font.family2,
    color: '#c4c4c4',
    fontSize: 14,
    fontWeight: 300,
    marginTop: 5,
  },
});
