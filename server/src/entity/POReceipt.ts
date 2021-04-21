import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class POReceipt {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  receiptNumber: String
  purchaseOrder: PurchaseOrder @relation(link: INLINE)
  receiptDate: DateTime
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/