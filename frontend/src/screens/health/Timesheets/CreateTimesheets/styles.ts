export default (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '40px 10px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    padding: '0px 10px',
  },
  pdfContent: {
    padding: '10px',
  },
  periodSelectionWrapper: {
    margin: '20px 0px',
  },
  inputs: {
    marginTop: 50,
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
  dragAreaWrapper: {
    width: 'auto',
    height: 'auto',
    border: '0px',
    cursor: 'pointer',
  },
  activeDragArea: {
    backgroundColor: theme.palette.grey['100'],
  },
  dragText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 17,
    fontWeight: '500',
    color: theme.palette.primary.color2,
    padding: '20px 10px',
    textAlign: 'center',
  },

  finaliseDesc: {
    textAlign: 'center',
  },
});

export const timesheetRowStyles = (theme) => ({
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
    padding: '0px 0px',
    height: 50,
    minWidth: 58,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 25,
    cursor: 'pointer',
    color: theme.palette.primary.color2,
    border: `1px solid ${theme.palette.grey['300']}`,
    '&.active': {
      backgroundColor: theme.palette.primary.color1,
      color: 'white',
    },
    '&.disabled': {
      cursor: 'not-allowed',
      pointerEvents: 'none',
    },
  },
  projectBtn: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  userBtn: {
    borderLeft: 0,
  },

  pDropdown: {
    minWidth: 200,
  },
  pDropdownSelect: {
    borderRadius: 0,
    borderLeft: 0,
    borderRight: 0,
  },
  sDropdown: {
    minWidth: 200,
  },
  sDropdownSelect: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dropdownItemText: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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
    '$dayWrapper:first-child &': {
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
    },
  },
  dayInputField: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'flex-end',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    minWidth: 50,
  },
  totalHours: {
    color: 'white',
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    marginRight: 5,
    // minWidth: 30,
    fontWeight: '500',
  },
  hoursSymbol: {
    color: theme.palette.shadow.color1,
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeIcon: {
    padding: '0px 15px',
    cursor: 'pointer',
    color: theme.palette.blueGrey['50'],
    height: 50,
    display: 'flex',
    alignItems: 'center',
  },
});

export const TimesheetApproveModalStyles = () => ({
  emailInputs: {
    marginTop: 15,
  },
});

export const fileBlockStyles = (theme) => ({
  component: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: [[20, 0]],
    width: 150,
    position: 'relative',
    '&:hover $hoverIconWrapper': {
      display: 'flex',
    },
    textDecoration: 'none',
  },
  icon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  ext: {
    position: 'absolute',
    fontFamily: theme.typography.font.family2,
    fontSize: 10,
    color: theme.palette.primary.color2,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  iconImage: {
    width: 50,
    height: 50,
  },
  filename: {
    fontFamily: theme.typography.font.family2,
    fontSize: 13,
    color: theme.palette.blueGrey['50'],
  },
  hoverIconWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  linkIconWrapper: {
    padding: 5,
    borderRadius: '50%',
    border: '2px solid white',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  linkIcon: {
    fontSize: '20px !important',
    color: 'white',
    cursor: 'pointer',
  },
  closeIconWrapper: {
    padding: 5,
    borderRadius: '50%',
    border: '2px solid white',
    width: 20,
    height: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: 'white',
    fontSize: '20px !important',
    cursor: 'pointer',
  },
});
