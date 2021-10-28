export type StyleKeys = 'page' | 'patientNameCell';

export default (theme: Theme) => ({
  page: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  patientNameCell: {
    fontFamily: theme.typography.font.family2,
    color: theme.palette.primary.color2,
    cursor: 'pointer',
    fontWeight: 500,
    paddingLeft: 24,
    paddingRight: 24,
  },
});
