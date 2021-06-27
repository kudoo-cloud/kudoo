export default (theme) => ({
  page: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: 10,
  },
  blockWrapper: {
    position: 'relative',
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    '&.n-m-left': {
      marginLeft: 0,
    },
    '&.n-m-right': {
      marginRight: 0,
    },
    '&.n-m-top': {
      marginTop: 0,
    },
  },
  blockTitle: {
    backgroundColor: theme.palette.primary.color3,
    padding: [[15, 20]],
    fontFamily: theme.typography.font.family1,
    fontSize: 16,
    fontWeight: 700,
    color: 'white',
    border: `1px solid ${theme.palette.grey['200']}`,
    borderBottom: `0px solid`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blockContent: {
    border: `1px solid ${theme.palette.grey['200']}`,
    borderTop: `0px solid`,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: theme.palette.grey['100'],
  },
});

export const PurchaseOrderStyles = (theme) => ({
  purchaseOrderBlock: {
    padding: 20,
    backgroundColor: theme.palette.grey['100'],
  },
  purchaseOrderBlockItem: {
    display: 'flex',
    flexDirection: 'column',
  },
  purchaseOrderAmount: {
    padding: 35,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.typography.font.family2,
    color: 'white',
    fontWeight: 500,
    '$purchaseOrderBlockItem.green &': {
      backgroundColor: theme.palette.primary.color1,
    },
    '$purchaseOrderBlockItem.orange &': {
      backgroundColor: theme.palette.secondary.color1,
    },
  },
  purchaseOrderNumber: {
    padding: 5,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: theme.typography.font.family2,
    color: 'white',
    fontWeight: 300,
    '$purchaseOrderBlockItem.green &': {
      backgroundColor: theme.palette.shadow.color1,
    },
    '$purchaseOrderBlockItem.orange &': {
      backgroundColor: '#D98F21',
    },
  },
  purchaseOrderTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: theme.typography.font.family2,
    color: theme.palette.blueGrey['50'],
    fontWeight: 500,
    marginTop: 15,
  },
});
