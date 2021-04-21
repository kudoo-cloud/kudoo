import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class SalesOrder {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
    customer: Customer @relation(link: INLINE)
    transactionDate: DateTime
    currency: Currency
    company: Company! @relation(link: INLINE, onDelete: CASCADE)
    isArchived: Boolean @default(value: false)
    isDeleted: Boolean @default(value: false)
    createdAt: DateTime! @createdAt
    updatedAt: DateTime! @updatedAt
  }
  */