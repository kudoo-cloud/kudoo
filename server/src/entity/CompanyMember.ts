/*
type CompanyMember {
  id: ID! @id
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