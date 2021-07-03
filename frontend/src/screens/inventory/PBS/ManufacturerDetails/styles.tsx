export default (theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    padding: '40px 20px 0px',
    flex: 1,
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  detailsCardsWrapper: {
    marginBottom: 30,
  },
  detailCard: {
    alignSelf: 'stretch',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: theme.typography.font.family2,
    position: 'relative',
    color: theme.palette.blueGrey['50'],
  },
  detailCardHeader: {
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    padding: '0px 20px',
    color: 'white',
    fontWeight: 'bold',
    height: 70,
    display: 'flex',
    alignItems: 'center',
    '&.green': {
      backgroundColor: theme.palette.primary.color1,
    },
    '&.h1': {
      fontSize: 26,
    },
    '&.h2': {
      fontSize: 16,
    },
    '&.blue': {
      backgroundColor: theme.palette.primary.color2,
    },
    '&.black': {
      backgroundColor: theme.palette.primary.color3,
    },
  },
  detailCardContent: {
    padding: '10px 20px',
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    flex: 1,
    border: `1px solid ${theme.palette.grey['200']}`,
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    '&.withBG': {
      backgroundColor: theme.palette.grey['100'],
      border: 0,
    },
    '&.h1': {
      fontSize: 20,
    },
    '&.h2': {
      fontSize: 16,
    },
  },
  keyValue: {
    marginBottom: 5,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    fontSize: 20,
    cursor: 'pointer',
  },
  section: {
    marginTop: 30,
  },
  detailsForm: {
    marginTop: 30,
  },
  formHeading: {
    marginBottom: 20,
  },
  invoiceTable: {
    marginTop: 20,
  },
  detailsModal: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
  },
  editDaoModalDescription: {
    padding: 0,
  },
  modalForm: {
    padding: 0,
    paddingTop: 0,
  },
  formFields: {
    padding: 20,
  },
  detailsModalContent: {
    backgroundColor: 'white',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    maxWidth: 900,
  },
  modalCancelBtn: {
    borderBottomLeftRadius: 5,
    padding: '20px 10px',
  },
  modalSaveBtn: {
    borderBottomRightRadius: 5,
    padding: '20px 10px',
  },
});
