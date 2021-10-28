export default (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  tabContentWrapper: {
    padding: '40px 20px',
  },
  projectNameWrapper: {
    marginTop: 50,
  },
  progressWrapper: {
    marginTop: 30,
  },
  customerDetailsWrapper: {
    marginTop: 30,
  },
  details: {
    marginTop: 15,
  },
  detailWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    border: `1px solid ${theme.palette.grey['200']}`,
    padding: '10px 20px',
  },
  detailKey: {
    color: theme.palette.grey['400'],
    fontSize: 16,
    fontWeight: 300,
    fontFamily: theme.typography.font.family2,
  },
  detailValue: {
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    fontWeight: 300,
    fontFamily: theme.typography.font.family2,
  },
  servicesListHeader: {
    marginTop: 30,
  },
  archiveProjectName: {
    fontWeight: 500,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.shadow.color3,
  },
  archiveProjectButton: {
    color: theme.palette.secondary.color2,
    fontSize: 15,
    marginTop: 15,
    padding: 10,
    textDecoration: 'underline',
    fontWeight: 500,
    fontFamily: theme.typography.font.family2,
    cursor: 'pointer',
  },
  backToProjectButton: {
    padding: 20,
    backgroundColor: theme.palette.grey['300'],
    fontSize: 16,
    fontWeight: 500,
    fontFamily: theme.typography.font.family2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    cursor: 'pointer',
  },
});

export const ProjectProgressStyles = (theme) => ({
  component: {},
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    height: 80,
    marginRight: -40,
    '&:first-child $stepInfo': {
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
  },
  stepInfo: {
    padding: '0px 20px 0px 60px',
    backgroundColor: theme.palette.grey['200'],
    height: 80,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '.completed &': {
      backgroundColor: theme.palette.primary.color3,
    },
    '.next &': {
      backgroundColor: theme.palette.grey['300'],
    },
    '.current &': {
      backgroundColor: theme.palette.primary.color1,
    },
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: theme.typography.font.family1,
    color: theme.palette.grey['700'],
    fontWeight: 'bold',
    marginBottom: 10,
    '.current &': {
      color: 'white',
    },
    '.completed &': {
      color: theme.palette.grey['200'],
    },
  },
  stepDate: {
    fontSize: 15,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.grey['500'],
    '.current &': {
      color: theme.palette.shadow.color1,
    },
    '.completed &': {
      color: theme.palette.grey['300'],
    },
  },
  stepArrow: {
    width: 0,
    height: 0,
    borderTop: `40px solid transparent`,
    borderBottom: `40px solid transparent`,
    borderLeft: `40px solid ${theme.palette.grey['200']}`,
    transition: 'all ease-in 0.2s',
    transform: 'rotate(0deg)',
    '.current &': {
      borderLeftColor: theme.palette.primary.color1,
    },
    '.next &': {
      borderLeftColor: theme.palette.grey['300'],
    },
    '.completed &': {
      borderLeftColor: theme.palette.primary.color3,
    },
  },
});

export const ServiceListItemStyles = (theme) => ({
  wrapper: {
    marginTop: 20,
  },
  headerWrapper: {
    backgroundColor: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 0,
  },
  headerTitle: {
    flex: 1,
    display: 'flex',
    color: 'white',
    fontFamily: theme.typography.font.family2,
    fontWeight: 'bold',
    fontSize: 16,
    paddingLeft: 20,
  },
  priceWrapper: {
    paddingRight: 20,
  },
  price: {
    color: 'white',
    marginBottom: 7,
    fontFamily: theme.typography.font.family2,
    fontWeight: 'bold',
    fontSize: 16,
  },
  gstLabel: {
    color: theme.palette.shadow.color1,
    fontFamily: theme.typography.font.family2,
    fontSize: 14,
  },
  arrowWrapper: {
    backgroundColor: theme.palette.shadow.color1,
    padding: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&.edit': {
      borderRight: `2px solid ${theme.palette.primary.color1}`,
    },
  },
  editIcon: {
    fontSize: '20px !important',
    color: 'white',
  },
  collapse: {
    backgroundColor: theme.palette.grey['100'],
    border: `1px solid ${theme.palette.grey['300']}`,
    borderTop: 0,
  },
  collapseContent: {
    padding: 20,
  },
  cellHeader: {
    color: theme.palette.grey['400'],
    fontFamily: theme.typography.font.family2,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cellValue: {
    color: theme.palette.blueGrey['50'],
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
  },
  row: {
    marginTop: 5,
  },
});
