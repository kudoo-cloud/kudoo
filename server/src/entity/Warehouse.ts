import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Warehouse {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  name: String
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/