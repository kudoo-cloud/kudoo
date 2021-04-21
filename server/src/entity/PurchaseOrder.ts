import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class PurchaseOrder {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  pbsOrganisation: String
  date: DateTime
  orderer: User @relation(link: INLINE)
  status: PoStatus
  supplier: Supplier @relation(link: INLINE)
  isPbsPO: Boolean
  poNumber: Int!
  preview: Attachment @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/