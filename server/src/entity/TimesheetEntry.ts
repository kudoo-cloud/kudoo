/*
type TimeSheetEntry {
  id: ID! @id
  customer: Customer @relation(link: INLINE)
  date: DateTime
  duration: Float
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  isInvoiced: Boolean @default(value: false)
  project: Project @relation(link: INLINE)
  service: Service @relation(link: INLINE)
  timeSheet: TimeSheet @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/