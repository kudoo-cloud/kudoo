export default () => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  tabContent: {
    padding: 30,
  },
  sendInvoiceSectionHeader: {
    marginTop: 25,
    marginBottom: 25,
  },
});

export const LayoutTabStyles = (theme) => ({
  tabContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  form: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  formContent: {
    padding: 30,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  layoutSectionHeader: {
    marginBottom: 25,
  },
  field: {
    margin: [[10, 0]],
  },
  approvalField: {
    marginTop: 30,
  },
  defaultTextWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: 16,
    paddingLeft: 15,
    fontFamily: theme.typography.font.family2,
    color: '#c4c4c4',
    fontStyle: 'italic',
  },
  workDaySectionHeader: {
    marginTop: 55,
    marginBottom: 15,
  },
});
