import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class BankTransaction {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    transactionDate: Date;

    @Column()
    description: string;

    @Column()
    posted: boolean;

    @Column()
    ledgerJournal: string; //TODO: need to add relationship

}
/*
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/