import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

}
/*

  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  description: String
  govNumber: String
  salesTax: Boolean @default(value: true)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  name: String
  billingFrequency: SupplierTermsOfPayment
  meansTestedFee: MeansTestedFee @relation(link: INLINE)
  basicDailyFee: BasicDailyFee @relation(link: INLINE)
  contacts: [Contact]
  addresses: [Address]
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/