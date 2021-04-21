import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Inventory {

    @PrimaryGeneratedColumn()
    id: number;

}
/*

  name: String
  inventoryModel: InventoryModel
  uom: UOM
  price: Float
  SellingPrice: Float
  Barcode: String
  Taxable: Boolean
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/