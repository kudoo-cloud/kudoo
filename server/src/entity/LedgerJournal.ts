import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class LedgerJournal {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  total: Float
  description: String
  currency: Currency!
  includeConsTax: Boolean!
  posted: Boolean!
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/