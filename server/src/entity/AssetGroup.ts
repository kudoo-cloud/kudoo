import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class AssetGroup {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    depreciationType: string; //Add AssetGroupDepreciationType enum here

    @Column()
    usefulLife: number;

    @Column()
    postCode: string;

}
/*
  deprMainAccount: MainAccount @relation(link: INLINE)
  #accumDeprMainAccount: MainAccount @relation(link: INLINE)
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/