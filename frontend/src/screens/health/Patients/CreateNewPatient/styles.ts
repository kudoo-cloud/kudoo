export type StyleKeys =
  | 'page'
  | 'allSteps'
  | 'cancelButtonText'
  | 'prevNextWrapper'
  | 'prevNextButton'
  | 'content'
  | 'dataSheet'
  | 'bulkUploadColumnHeading'
  | 'bulkUploadCell'
  | 'checkbox'
  | 'removeNameButton';

export default (theme: Theme): StyleFnReturnType<StyleKeys> => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  allSteps: {
    padding: '40px 20px 100px',
    flex: 1,
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
  cancelButtonText: {
    color: theme.palette.primary.color3,
  },
  dataSheet: {
    width: '100%',
    marginTop: 25,
  },
  bulkUploadColumnHeading: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  bulkUploadCell: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  checkbox: {
    paddingTop: 37,
  },
  removeNameButton: {
    marginTop: 37,
  },
});
