import URL from 'src/helpers/urls';
import { IRoute } from 'src/store/types/security';
import * as Components from '../LoadableComponents';
import * as Tabs from './tab';

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

  {
    name: 'Create Contributor',
    path: URL.CREATE_CONTRIBUTORS(paramsOptions),
    component: Components.CreateContributor,
  },
  {
    name: 'Edit Contributor',
    path: URL.EDIT_CONTRIBUTORS(paramsOptions),
    component: Components.CreateContributor,
  },
  {
    name: 'Contributors',
    path: URL.CONTRIBUTORS(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.contributorsTabs,
  },

  {
    name: 'Create Policy',
    path: URL.CREATE_POLICIES(paramsOptions),
    component: Components.CreatePolicy,
  },
  {
    name: 'Edit Policy',
    path: URL.EDIT_POLICIES(paramsOptions),
    component: Components.CreatePolicy,
  },

  {
    name: 'Policies',
    path: URL.POLICIES(paramsOptions),
    component: Components.SecondaryTabs,
    tabs: Tabs.contributorsTabs,
  }
] as IRoute[];
