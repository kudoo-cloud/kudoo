import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Contact {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  name: String
  surname: String
  email: String
  mobileCode: String
  mobileNumber: String
  landlineCode: String
  landlineNumber: String
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/