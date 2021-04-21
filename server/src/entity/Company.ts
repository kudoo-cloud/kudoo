/*
type Company {
    id: ID! @id
    bankAccount: Json
    businessType: BusinessType
    country: Country! @default(value: AU)
    govNumber: String
    currency: Currency!
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