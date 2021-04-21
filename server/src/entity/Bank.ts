import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Bank {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    institution: string;

    @Column()
    bsb: string;

    @Column()
    accountNumber: string;

}
/*
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/