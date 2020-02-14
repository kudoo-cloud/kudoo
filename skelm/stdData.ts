export const standardMainAccounts = [
  {
    code: '1001',
    name: 'Revenue',
    type: 'REVENUE',
  },
  {
    code: '3001',
    name: 'Bank account',
    type: 'ASSET',
  },
  {
    code: '3002',
    name: 'Tax receivable',
    type: 'ASSET',
  },
  {
    code: '3003',
    name: 'Debtors control',
    type: 'ASSET',
  },
  {
    code: '4001',
    name: 'Tax payable',
    type: 'LIABILITY',
  },
];

export const standardPostings = [
  {
    postingType: 'REVENUE',
    mainAccount: '1001',
  },
  {
    postingType: 'BANK',
    mainAccount: '3001',
  },
  {
    postingType: 'TAXRECEIVABLE',
    mainAccount: '3002',
  },
  {
    postingType: 'DRCONTROL',
    mainAccount: '3003',
  },
  {
    postingType: 'TAXPAYABLE',
    mainAccount: '4001',
  },
];

export const productTemplate = {
  storage: "location",
  tracking: "none",
  inventoryModel: "weighted_average",
  salesItemTax: "none",
  purchaseItemTax: "none",
  uom: "each",
}
