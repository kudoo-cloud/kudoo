import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ApInvoice {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string; //Add ApInvoiceStatus enum here

    @Column()
    invoiceNumber: string;

    @Column()
    purchaseOrder: string; //TODO: Add relationship

    @Column()
    company: string; //TODO: Add relationship

}
/*
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/