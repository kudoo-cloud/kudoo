import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Session {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  expires_at: DateTime
  is_active: Boolean @default(value: true)
  is_archived: Boolean @default(value: false)
  is_deleted: Boolean @default(value: false)
  signed_at: DateTime
  user: User @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/