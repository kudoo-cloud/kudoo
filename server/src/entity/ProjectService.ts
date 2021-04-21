import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProjectService {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  amount: Float
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  project: Project @relation(link: INLINE)
  rules: [ProjectServiceRule]
  service: Service @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/