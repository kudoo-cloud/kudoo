import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Invoice {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  title: String
  attachments: [Attachment] @relation(name: "InvoiceAttachments")
  buyer: Customer @relation(link: INLINE)
  number: Int
  description: String
  invoiceDate: DateTime
  dueDate: DateTime
  preview: Attachment @relation(link: INLINE, name: "InvoicePreview")
  items: [InvoiceItemEntry]
  seller: Company! @relation(link: INLINE, onDelete: CASCADE)
  status: InvoiceStatus
  type: InvoiceType
  total: Float
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/