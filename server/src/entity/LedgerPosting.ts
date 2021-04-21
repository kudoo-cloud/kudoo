import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class LedgerPosting {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  postingType: PostingType
  mainAccount: MainAccount @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/