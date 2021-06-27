export default (theme: Theme) => ({
  loggedInWrapper: {},
  drawerWrapper: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 9000,
    overflowY: 'auto',
  },
  loggedInRightContent: {
    marginLeft: 250,
    transition: 'all ease-in 0.2s',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    '&.is-drawer-closed': {
      marginLeft: 70,
    },
    '&.is-drawer-hidden': {
      marginLeft: 0,
    },
  },

  noInternet: {
    height: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.palette.secondary.color2,
    color: 'white',
    fontWeight: 'bold',
  },

  drawerMenuItem: {
    padding: '20px',
    flexDirection: 'row',
    alignItems: 'center',
    display: 'flex',
    borderBottom: `1px solid ${theme.palette.blueGrey[50]}`,
    cursor: 'pointer',
    '&.active': {
      backgroundColor: theme.palette.shadow.color3,
    },
  },
  itemIcon: {
    marginRight: '20px',
    fontSize: '30px',
    color: theme.palette.primary.color1,
    display: 'flex',
  },
  itemTitle: {
    fontSize: '16px',
    color: theme.palette.grey[300],
    fontFamily: theme.typography.font.family2,
    fontWeight: '300',
  },
});

export const toastStyle = {
  fontSize: 16,
  fontWeight: 500,
  textAlign: 'center',
  minHeight: 50,
  fontFamily: "'montserrat', sans-serif",
  borderRadius: 3,
  lineHeight: '22px',
};
