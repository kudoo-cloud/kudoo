import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Asset {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    assetGroup: string; //TODO: add relationship

    @Column()
    dateOfAquisition: Date;

    @Column()
    aquisitionPrice: number;

    @Column()
    netBookValue: number;

    @Column()
    depreciation: number;

    @Column()
    salvageValue: number;

    @Column()
    company: string; //TODO: add relationship

}
/*
  salvageValue: Float
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/