export default (theme) => ({
  page: {},
  content: {
    // padding: '0px 20px 20px',
  },
  sectionHeading: {
    marginTop: 40,
    padding: '0px 20px 0px',
  },
  gstHeading: {
    padding: '0px',
  },
  logoImageWrapper: {
    padding: '20px 20px 0px',
  },
  dropzoneAreaWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  uploadedLogoPreview: {
    width: 360,
    height: 130,
    borderRadius: 5,
    backgroundPosition: 'center',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#f4f4f4',
    display: 'flex',
  },
  logoImage: {},
  selectNewImageText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 18,
    fontWeight: 500,
    color: '#fff',
    flex: 1,
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 5,
    cursor: 'pointer',
    '$uploadedLogoPreview:hover &': {
      display: 'flex',
    },
  },
  dropzoneText: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 300,
    color: '#838383',
  },
  imageNote: {
    fontFamily: theme.typography.font.family2,
    fontSize: 16,
    fontWeight: 300,
    marginTop: 10,
    color: '#838383',
    lineHeight: '26px',
  },
  deleteIcon: {
    color: 'red',
    fontSize: 30,
    margin: [[0, 20]],
  },
  formWrapper: {},
  formFields: {
    padding: '0px 20px 20px',
  },
  fieldRow: {
    marginTop: 20,
    position: 'relative',
  },
  sameAsAboveCheckbox: {
    position: 'absolute',
    bottom: 6,
    right: -175,
  },
  halfFieldWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  abnInput: {
    marginRight: 10,
  },
  gstLabel: {
    fontFamily: "'montserrat', sans-serif",
    fontSize: 15,
    fontWeight: 300,
    margin: '20px 0px',
    color: '#838383',
  },
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  deleteCompanyText: {
    color: theme.palette.secondary.color2,
    margin: '10px 0px',
    padding: [[10, 20]],
    fontFamily: theme.typography.font.family2,
    textDecoration: 'underline',
    fontSize: 15,
  },
  deleteCompanyName: {
    fontWeight: '500',
    color: theme.palette.primary.color3,
    fontSize: 16,
  },
});
