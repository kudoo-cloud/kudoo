import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Address {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    street: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @Column()
    postCode: string;

}
/*
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/