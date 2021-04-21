import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
    company: Company! @relation(link: INLINE, onDelete: CASCADE)
    customer: Customer @relation(link: INLINE)
    description: String
    endsAt: DateTime
    isArchived: Boolean @default(value: false)
    isDeleted: Boolean @default(value: false)
    name: String
    projectService: [ProjectService]
    startsAt: DateTime
    status: ProjectStatus
    createdAt: DateTime! @createdAt
    updatedAt: DateTime! @updatedAt
  }
  */