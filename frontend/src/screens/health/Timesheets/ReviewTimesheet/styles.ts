export default theme => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '40px 20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  periodSelectionWrapper: {
    margin: '20px 0px',
  },
  inputs: {
    marginTop: 30,
  },
  textValueBox: {
    height: 52,
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey['300']}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0px 15px',
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
  },
  newRowButton: {
    marginTop: 20,
  },
  cancelButtonText: {
    color: theme.palette.grey['500'],
  },

  attachementWrapper: {
    marginTop: 15,
  },
  attachedFilesBlock: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  attachementBlock: {
    border: `2px dashed ${theme.palette.primary.color2}`,
    borderRadius: 5,
  },
});

export const timesheetRowStyles = theme => ({
  wrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  selectionWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    marginTop: (props: any) => (props.hideDaysLabel ? 10 : 50),
    marginRight: 15,
    flex: 1,
  },
  selectBtn: {
    padding: '0px 15px',
    height: 50,
    display: 'flex',
    alignItems: 'center',
    fontSize: 25,
    cursor: 'pointer',
    color: theme.palette.primary.color2,
    border: `1px solid ${theme.palette.grey['300']}`,
    '&.active': {
      backgroundColor: theme.palette.primary.color1,
      color: 'white',
    },
    '&.disabled': {
      color: theme.palette.grey['300'],
    },
  },
  projectBtn: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  userBtn: {
    borderLeft: 0,
  },
  textValueBox: {
    height: 50,
    borderRadius: 5,
    border: `1px solid ${theme.palette.grey['300']}`,
    display: 'flex',
    alignItems: 'center',
    padding: '0px 15px',
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    color: theme.palette.blueGrey['50'],
  },

  pDropdown: {
    minWidth: 200,
    borderRadius: 0,
    borderLeft: 0,
    borderRight: 0,
    flex: 1,
  },
  sDropdown: {
    minWidth: 200,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'flex-end',
    marginTop: (props: any) => (props.hideDaysLabel ? 10 : 0),
  },
  dayWrapper: {
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
  },
  dayInitial: {
    color: theme.palette.blueGrey['50'],
    fontSize: 15,
    marginBottom: 5,
    fontFamily: theme.typography.font.family2,
  },
  dayNumber: {
    color: theme.palette.primary.color1,
    fontSize: 16,
    marginBottom: 10,
    fontFamily: theme.typography.font.family2,
    fontWeight: 'bold',
  },
  dayInput: {
    width: 60,
  },
  dayInputWapper: {
    borderRadius: 0,
    borderRightWidth: 0,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    '$dayWrapper:first-child &': {
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
  },
  totalLabel: {
    color: theme.palette.blueGrey['50'],
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  totalHoursWrapper: {
    backgroundColor: theme.palette.primary.color1,
    padding: '0px 15px',
    height: 52,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  totalHours: {
    color: 'white',
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    marginRight: 5,
    minWidth: 30,
    fontWeight: '500',
  },
  hoursSymbol: {
    color: theme.palette.shadow.color1,
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
