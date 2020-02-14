export type ClassKeys = 'root' | 'upgradeIcon' | 'upgradeMessageText';

export default (theme: Theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeIcon: {
    fontSize: '50px !important',
    color: theme.palette.primary.color1,
    marginBottom: 10,
  },
  upgradeMessageText: {
    marginBottom: 25,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.primary.color1,
    fontWeight: 'bold',
    fontSize: 30,
  },
});
