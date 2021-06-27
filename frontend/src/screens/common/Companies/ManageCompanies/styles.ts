export default (theme) => ({
  page: {
    padding: '40px 10px',
  },
  collapseRoot: {
    marginBottom: 10,
  },
  collapseTitle: {
    backgroundColor: theme.palette.primary.color3,
    padding: 20,
    fontFamily: theme.typography.font.family2,
    fontSize: 25,
    fontWeight: 500,
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapseIcon: {
    transform: 'rotate(0deg)',
    transition: 'all ease-in 0.2s',
    '&.down': {
      transform: 'rotate(90deg)',
    },
  },
  collapseContent: {
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardComponent: {
    marginRight: 10,
    marginBottom: 10,
  },
  companyCard: {
    cursor: 'pointer',
  },
  companyCardWrapper: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
  },
  deletedCompanyMsgWrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    fontFamily: theme.typography.font.family2,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  deletedCompanyMsg: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: '25px',
  },
});

export const JoinModalStyles = (theme) => ({
  modalWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 10000,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    height: 0,
    transition: 'opacity 0.1s ease-in',
    '&.visible': {
      opacity: 1,
      height: '100vh',
    },
    '&.hide': {
      opacity: 0,
      height: 0,
    },
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 5,
    maxWidth: 600,
    minWidth: 600,
  },
  title: {
    padding: 40,
    fontSize: 24,
    fontFamily: theme.typography.font.family1,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.palette.primary.color1,
  },
  contentWrapper: {
    padding: 20,
    paddingTop: 0,
  },
  fieldTitle: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
    fontSize: 17,
    marginTop: 20,
    textAlign: 'center',
  },
  joinCompanyFieldContent: {
    marginTop: 20,
  },
  accessCodeField: {
    textAlign: 'center',
    fontSize: 30,
    padding: '10px !important',
  },
  buttons: {
    marginTop: 20,
  },
  cancelButtonText: {
    color: theme.palette.blueGrey['50'],
  },
});
