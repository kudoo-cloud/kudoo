import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

}

/*
type User {
  id: ID! @id
  contactNumber: Json
  email: String
  firstName: String
  isActive: Boolean @default(value: false)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  isRoot: Boolean @default(value: false)
  jobTitle: String
  lastName: String
  password: String
  secondAuthEnabled: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/