import URL from '@client/helpers/urls';
import * as Tabs from './tab';
import { IRoute } from '@client/store/types/security';
import * as Components from '../LoadableComponents';

const paramsOptions = { path: true };

export default [
  {
    name: 'Create Main Account',
    path: URL.CREATE_MAIN_ACCOUNT(paramsOptions),
    component: Components.CreateMainAccount,
  },
  {
    name: 'Edit Main Account',
    path: URL.EDIT_MAIN_ACCOUNT(paramsOptions),
    component: Components.CreateMainAccount,
  },
  {
    name: 'Create Ledger Posting',
    path: URL.CREATE_LEDGER_POSTING(paramsOptions),
    component: Components.CreateLedgerPosting,
  },
  {
    name: 'Edit Ledger Posting',
    path: URL.EDIT_LEDGER_POSTING(paramsOptions),
    component: Components.CreateLedgerPosting,
  },
  {
    name: 'Create Ledger Journal',
    path: URL.CREATE_LEDGER_JOURNAL(paramsOptions),
    component: Components.CreateLedgerJournal,
  },
  {
    name: 'Edit Ledger Journal',
    path: URL.EDIT_LEDGER_JOURNAL(paramsOptions),
    component: Components.CreateLedgerJournal,
  },
  {
    name: 'Ledger',
    path: URL.LEDGER(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.ledgerTabs,
  },
  {
    name: 'Create Bank Transactions',
    path: URL.CREATE_BANK_TRANSACTIONS(paramsOptions),
    component: Components.CreateBankTransaction,
  },
  {
    name: 'Edit Bank Transactions',
    path: URL.EDIT_BANK_TRANSACTIONS(paramsOptions),
    component: Components.CreateBankTransaction,
  },
  {
    name: 'Banking',
    path: URL.BANKING(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.bankTabs,
  },
  {
    name: 'Create Asset Group',
    path: URL.CREATE_ASSET_GROUP(paramsOptions),
    component: Components.CreateAssetGroup,
  },
  {
    name: 'Edit Asset Group',
    path: URL.EDIT_ASSET_GROUP(paramsOptions),
    component: Components.CreateAssetGroup,
  },
  {
    name: 'Create Asset',
    path: URL.CREATE_ASSET(paramsOptions),
    component: Components.CreateAsset,
  },
  {
    name: 'Edit Asset',
    path: URL.EDIT_ASSET(paramsOptions),
    component: Components.CreateAsset,
  },
  {
    name: 'Assets',
    path: URL.ASSETS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.assetTabs,
  },
  {
    name: 'Reporting',
    path: URL.REPORTING(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.reportingTabs,
  },
  {
    name: 'Data Import',
    path: URL.DATAIMPORT(paramsOptions),
    component: Components.DataImportFile,
  },
] as IRoute[];
