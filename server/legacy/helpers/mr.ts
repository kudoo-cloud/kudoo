import { prisma, LedgerTransaction, MainAccountType, MainAccount } from '../../prisma/generated/prisma-client'

interface ILedgerTotalParameters {
    posted: boolean,
    startDate: Date,
    endDate: Date,
    companyID: string
    accountType: MainAccountType
}

async function getMainAccounts(accountType, companyID): Promise<Array<MainAccount>> {
    const expenseAccounts = await prisma.mainAccounts({
        where: {
            type: accountType,
            company: {
                id: companyID
            }
        }
    })
    return expenseAccounts
}

async function getLedgerTotals(parameters: ILedgerTotalParameters): Promise<number> {
    
    let transactions:Array<Array<LedgerTransaction>> = []
    let total: number = 0

    const mainAccounts = await getMainAccounts(parameters.accountType, parameters.companyID)
    
    for (let index = 0; index < mainAccounts.length; index++) {
        transactions.push(await prisma.ledgerTransactions({
            where: {
                company: {
                    id: parameters.companyID
                },
                ledgerJournal: {
                    posted: parameters.posted,
                },
                mainAccount: {
                    id: mainAccounts[index].id
                },
            }
        })
      )
      for (let index = 0; index < transactions.length; index++) {
        total += transactions[index].reduce((a, b) => a + b.amount, 0)   
      }  
    }

    return total
}

async function main() {

    const companyID = "cjy9jc15a000y07484tbpz93c";
    const parameters: ILedgerTotalParameters = {
        posted: true,
        startDate: new Date(1/1/2019),
        endDate: new Date(31/7/2019),
        companyID: companyID,
        accountType: "EXPENSE"
    }

    let ts = await prisma.timeSheet({
        id: ""
    }).attachments()

    const revenueTotal = await getLedgerTotals(parameters);
    console.log(revenueTotal);
}

main().catch(e => console.log(e))

// Equity, Assets, Expenses DR goes up
// Revenue, Liabilities CR goes up
