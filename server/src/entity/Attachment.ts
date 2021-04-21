import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Attachment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    fileName: string;

    @Column()
    label: string;

    @Column()
    url: string;

}
/*
  s3Bucket: String
  s3Key: String
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}

*/