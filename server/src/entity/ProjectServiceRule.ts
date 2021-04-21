import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class ProjectServiceRule {

    @PrimaryGeneratedColumn()
    id: number;

}
/*
  projectService: ProjectService @relation(link: INLINE)
  amount: Float
  percent: Float
  type: ProjectServiceRuleType
  isPercent: Boolean
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/
