import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Company {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    bank: string; //TODO: add banking relationship

    @Column()
    country: string; //Add enum Country

    @Column()
    govNumber: string;

    @Column()
    currency: string; // Add enum Currency

}
/*
    isArchived: Boolean @default(value: false)
    isDeleted: Boolean @default(value: false)
    HPIO: String
    legalName: String!
    logo: Attachment @relation(link: INLINE)
    name: String!
    salesTax: Boolean @default(value: false)
    timeSheetSettings: Json
    websiteURL: String
    addresses: [Address]
    contacts: [Contact]
    companyMembers: [CompanyMember]
    activePlan: Plan @relation(link: INLINE)
    stripeCustomerId: String
    createdAt: DateTime! @createdAt
    updatedAt: DateTime! @updatedAt
  }
  */