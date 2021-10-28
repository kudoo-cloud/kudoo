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
  formHeading: {
    marginTop: 40,
  },
  form: {
    marginTop: 20,
  },
  halfFieldWRow: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  input: {
    marginTop: 10,
    position: 'relative',
  },
  leftInput: {
    marginRight: 10,
  },
  searchInputWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  searchIcon: {
    backgroundColor: theme.palette.primary.color1,
    padding: '16px 25px',
    color: 'white',
    fontSize: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftButtonWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  checkbox: {
    margin: '10px 0px',
  },
  chargeGSTCheckbox: {
    paddingTop: 25,
    marginTop: 12,
  },
  noServices: {
    border: `1px solid ${theme.palette.grey['300']}`,
    borderRadius: 5,
    marginTop: 20,
    height: 400,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: 40,
  },
  noServicesText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 20,
    color: theme.palette.grey['400'],
    fontWeight: 'bold',
    textAlign: 'center',
    cursor: 'pointer',
  },
  services: {
    marginTop: 20,
  },
  serviceAlert: {
    border: `2px solid ${theme.palette.primary.color1}`,
    padding: 10,
    borderRadius: 5,
    margin: '20px 0px',
    color: theme.palette.primary.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceAlertText: {
    fontFamily: theme.typography.font.family1,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.palette.primary.color1,
    lineHeight: '22px',
  },
  alertRemoveIcon: {
    padding: '10px 20px',
    fontSize: 30,
    color: theme.palette.primary.color1,
    cursor: 'pointer',
  },

  rulesServices: {
    marginTop: 15,
  },
  rulesService: {
    border: `1px solid ${theme.palette.grey['300']}`,
    cursor: 'pointer',
    padding: 20,
    '&.active': {
      backgroundColor: theme.palette.primary.color3,
    },
  },
  rulesServiceName: {
    marginBottom: 10,
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
    '.active &': {
      color: 'white',
    },
  },
  rulesServiceAssign: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.grey['300'],
  },
  newRuleContainer: {
    marginTop: 0,
  },
  rulesList: {
    marginTop: 20,
    border: `1px solid ${theme.palette.grey['300']}`,
  },
  noRules: {
    fontFamily: theme.typography.font.family1,
    fontWeight: 'bold',
    fontSize: 17,
    padding: '30px 20px',
    color: theme.palette.grey['300'],
    textAlign: 'center',
    cursor: 'pointer',
  },
  rule: {
    borderBottom: `1px solid ${theme.palette.grey['300']}`,
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      borderBottom: '0px solid',
    },
  },
  ruleDescription: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    flex: 1,
  },
  ruleLabel: {
    flex: 1,
  },
  rulePercentage: {
    padding: '0px 10px',
    fontWeight: 'bold',
  },
  ruleAmount: {
    padding: '0px 10px',
    width: 60,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  highlightRuleText: {
    color: theme.palette.primary.color1,
    fontSize: 17,
  },
  ruleRemoveIcon: {
    padding: '20px 25px',
    borderLeft: `1px solid ${theme.palette.grey['300']}`,
    fontSize: 25,
    color: theme.palette.grey['300'],
    cursor: 'pointer',
  },
  serviceTotal: {
    backgroundColor: theme.palette.primary.color3,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  serviceTotalLabel: {
    fontFamily: theme.typography.font.family1,
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
});

export const ReviewStepStyles = (theme) => ({
  projectNameWrapper: {
    backgroundColor: theme.palette.primary.color1,
    padding: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    fontSize: 24,
    fontFamily: theme.typography.font.family1,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 15,
    display: 'flex',
    alignItems: 'center',
  },
  projectInfoWrapper: {},
  reviewSection: {},
  reviewSectionHeader: {
    backgroundColor: theme.palette.grey['100'],
    padding: 20,
    fontSize: 24,
    fontFamily: theme.typography.font.family1,
    color: theme.palette.blueGrey['50'],
    border: `1px solid ${theme.palette.grey['300']}`,
    borderBottom: '0px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
  },
  reviewSectionContent: {
    padding: 20,
    border: `1px solid ${theme.palette.grey['300']}`,
    borderBottom: '0px',
  },
  customerValue: {
    margin: [[10, 0]],
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    height: 18,
  },
  customerKey: {
    margin: [[10, 0]],
    color: '#c4c4c4',
    fontSize: 16,
  },
  value: {
    margin: [[10, 0]],
    color: theme.palette.blueGrey['50'],
    fontSize: 16,
    height: 18,
  },
  greenValue: {
    color: theme.palette.primary.color1,
  },
  editIcon: {
    fontSize: '17px !important',
    color: theme.palette.primary.color2,
    marginLeft: 15,
    cursor: 'pointer',
  },
  sectionWithBottomBorder: {
    borderBottom: `1px solid ${theme.palette.grey['300']}`,
  },
});

export const ServiceBlockStyles = (theme) => ({
  serviceBlock: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: theme.palette.grey['100'],
    border: `1px solid ${theme.palette.grey['300']}`,
    '&:first-child': {
      borderTopRightRadius: 5,
      borderTopLeftRadius: 5,
    },
    '&:last-child': {
      borderBottomRightRadius: 5,
      borderBottomLeftRadius: 5,
    },
  },
  serviceInfo: {
    padding: 20,
    flex: 1,
    borderRight: `1px solid ${theme.palette.grey['300']}`,
  },
  serviceName: {
    fontFamily: theme.typography.font.family2,
    fontSize: 18,
    color: theme.palette.grey['600'],
  },
  serviceTypeWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  serviceType: {
    fontFamily: theme.typography.font.family2,
    fontSize: 15,
    color: theme.palette.grey['500'],
  },
  servicePrice: {
    fontFamily: theme.typography.font.family2,
    fontSize: 15,
    color: theme.palette.grey['500'],
  },
  serviceRemoveIcon: {
    padding: '10px 30px',
    fontSize: 30,
    color: theme.palette.grey['400'],
    cursor: 'pointer',
  },
});
