import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class CompanyMember {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  company: Company! @relation(link: INLINE)
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  role: CompanyMemberRole
  status: CompanyMemberStatus
  user: User @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/