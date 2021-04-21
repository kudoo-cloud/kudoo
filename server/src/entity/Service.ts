import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Service {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  billingType: ServiceBillingType!
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  includeConsTax: Boolean!
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  isTemplate: Boolean @default(value: true)
  name: String!
  timeBasedType: TimeBasedType
  totalAmount: Float!
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/