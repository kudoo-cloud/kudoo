import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class InvoiceItemEntry {

    @PrimaryGeneratedColumn()
    id: number;

}
/*

  order: Int
  description: String
  name: String
  price: Float
  quantity: Float
  tax: Float
  invoice: Invoice @relation(link: INLINE)
  project: Project @relation(link: INLINE)
  service: Service @relation(link: INLINE)
  timeSheetEntry: TimeSheetEntry @relation(link: INLINE)
  timeSheet: TimeSheet @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/