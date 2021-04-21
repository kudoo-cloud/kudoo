import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class InventoryOnHand {

    @PrimaryGeneratedColumn()
    id: number;

}
/*

  date: DateTime
  item: Inventory @relation(link: INLINE)
  pbsDrug: String
  onHandQty: Int
  purchaseOrder: PurchaseOrder @relation(link: INLINE)
  warehouse: WareHouse @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/