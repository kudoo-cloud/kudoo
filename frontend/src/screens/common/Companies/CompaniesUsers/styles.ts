export type StyleKeys =
  | 'page'
  | 'sectionHeadingWrapper'
  | 'heading'
  | 'subtext'
  | 'resendEmailIconCell';

export default (theme: Theme): StyleFnReturnType<StyleKeys> => ({
  page: {
    padding: '0px 20px 20px',
  },
  sectionHeadingWrapper: {
    margin: '30px 0px',
  },
  heading: {
    fontFamily: "'roboto condensed', sans-serif",
    fontSize: 25,
    fontWeight: 500,
    color: '#4D5769',
  },
  subtext: {
    fontFamily: "'montserrat', sans-serif",
    fontSize: 15,
    fontWeight: 300,
    color: '#4D5769',
    marginTop: 10,
  },
  resendEmailIconCell: {
    fontSize: 20,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    borderLeft: `1px solid ${theme.palette.grey['200']}`,
    minHeight: 50,
  },
});
