import { prisma, Country, Company } from '../../prisma/generated/prisma-client';
import faker from 'faker';

interface IDateRange {
  endYear: Number;
  endMonth: Number;
  endDay: Number;
  startYear: Number;
  startMonth: Number;
  startDay: Number;
}

async function main() {
  console.log('Cleaning the database');
  await cleanDB();
  console.log('Creating an Aussie Company');
  const aussieCompany = await createCompany('AU');
  console.log('Creating a Chart of Accounts');
  await createMainAccounts(aussieCompany.id);
  console.log('Creating unposted Journal');
  const journalID = await createJournal(aussieCompany.id);
  console.log('Posting 3 months of history beeyatch!');
  let dateRange: IDateRange = {
    startDay: 1,
    startMonth: 0,
    startYear: 2017,
    endDay: 31,
    endMonth: 11,
    endYear: 2017,
  };
  await createTransactions(aussieCompany.id, journalID, dateRange);
  dateRange = {
    startDay: 1,
    startMonth: 0,
    startYear: 2018,
    endDay: 31,
    endMonth: 11,
    endYear: 2018,
  };
  await createTransactions(aussieCompany.id, journalID, dateRange);
  dateRange = {
    startDay: 1,
    startMonth: 0,
    startYear: 2019,
    endDay: 31,
    endMonth: 11,
    endYear: 2019,
  };
  await createTransactions(aussieCompany.id, journalID, dateRange);
  console.log('Posting that sheeyat');
  await postJournal(journalID);
}

function getDates(dateRange): Array<Date> {
  let now = new Date();
  let transactionDays = [];
  for (
    let d = new Date(
      dateRange.startYear,
      dateRange.startMonth,
      dateRange.startDay
    );
    d <= new Date(dateRange.endYear, dateRange.endMonth, dateRange.endDay);
    d.setDate(d.getDate() + 15)
  ) {
    transactionDays.push(new Date(d));
  }
  return transactionDays;
}

async function cleanDB() {
  await prisma.deleteManyLedgerTransactions();
  await prisma.deleteManyLedgerJournals();
  await prisma.deleteManyMainAccounts();
  await prisma.deleteManyCompanies();
  await prisma.deleteManyMedicareServices();
}

async function createCompany(country: Country): Promise<Company> {
  const company = await prisma.createCompany({
    name: faker.company.companyName(),
    currency: 'AUD',
    country: country,
    legalName: faker.company.companyName(),
    salesTax: true,
  });

  return company;
}

async function createMainAccounts(companyID: string) {
  let expenseAccounts = [
    'Salaries',
    'Superannuation',
    'Contractors',
    'Cellphones',
    'Work clothes',
    'Training',
    'Registration fees',
    'Stationary',
    'Depreciation',
    'Books',
    'Flights',
    'Entertainment',
    'Staff functions',
    'Accomodation',
    'Parking',
    'Taxis/Trains',
    'Events',
    'Vehicle costs',
    'Online advertising',
    'Marketing costs',
    'Website costs',
    'Subscription software',
    'Infrastructure costs',
    'Broadband',
    'Drones - R&D',
    'Legal fees',
    'Workcover',
    'Professional Indemnity',
    'Vehicle Insurance',
    'Bank fees',
    'Donations',
    'Groceries',
    'Rental',
    'Electricity/Water',
    'Tools',
    'Office Equipment',
  ];

  await prisma.createMainAccount({
    code: faker.finance.account(),
    name: 'Consulting Revenue',
    type: 'REVENUE',
    company: {
      connect: {
        id: companyID,
      },
    },
  });

  await expenseAccounts.forEach(async (account) => {
    await prisma.createMainAccount({
      code: faker.finance.account(),
      name: account,
      type: 'EXPENSE',
      company: {
        connect: {
          id: companyID,
        },
      },
    });
  });
}

async function createJournal(companyID: string): Promise<string> {
  const journal = await prisma.createLedgerJournal({
    currency: 'AUD',
    includeConsTax: false,
    description: 'Demo Data Load',
    posted: false,
    company: {
      connect: {
        id: companyID,
      },
    },
  });
  return journal.id;
}

async function createTransactions(companyID, journalID, dateRange: IDateRange) {
  const revenueAccounts = await prisma.mainAccounts({
    where: {
      company: {
        id: companyID,
      },
      type: 'REVENUE',
    },
  });

  const expenseAccounts = await prisma.mainAccounts({
    where: {
      company: {
        id: companyID,
      },
      type: 'EXPENSE',
    },
  });

  const transDates = getDates(dateRange);

  transDates.forEach((date) => {
    revenueAccounts.forEach(async (account) => {
      await prisma.createLedgerTransaction({
        mainAccount: {
          connect: {
            id: account.id,
          },
        },
        ledgerJournal: {
          connect: {
            id: journalID,
          },
        },
        drcr: 'CREDIT',
        amount: Number(faker.finance.amount()),
        currency: 'AUD',
        date: date,
        company: {
          connect: {
            id: companyID,
          },
        },
      });
    });
  });
  transDates.forEach((date) => {
    expenseAccounts.forEach(async (account) => {
      await prisma.createLedgerTransaction({
        mainAccount: {
          connect: {
            id: account.id,
          },
        },
        ledgerJournal: {
          connect: {
            id: journalID,
          },
        },
        drcr: 'DEBIT',
        amount: Number(faker.finance.amount()),
        currency: 'AUD',
        date: date,
        company: {
          connect: {
            id: companyID,
          },
        },
      });
    });
  });
}

async function postJournal(journalID) {
  await prisma.updateLedgerJournal({
    data: {
      posted: true,
    },
    where: {
      id: journalID,
    },
  });
}

main().catch((e) => console.error(e));
