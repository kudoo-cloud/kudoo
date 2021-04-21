import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class LedgerTransaction {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  mainAccount: MainAccount! @relation(link: INLINE)
  ledgerJournal: LedgerJournal! @relation(link: INLINE)
  drcr: DrCr!
  amount: Float!
  currency: Currency!
  date: DateTime!
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/