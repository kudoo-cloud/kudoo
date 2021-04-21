/*
type TimeSheet {
  id: ID! @id
  attachments: [Attachment] @relation(name: "TimesheetAttachments")
  company: Company! @relation(link: INLINE, onDelete: CASCADE)
  endsAt: DateTime
  isArchived: Boolean @default(value: false)
  isDeleted: Boolean @default(value: false)
  number: Int
  preview: Attachment @relation(link: INLINE, name: "TimesheetPreview")
  startsAt: DateTime
  status: TimeSheetStatus
  timeSheetEntries: [TimeSheetEntry]
  user: User @relation(link: INLINE)
  createdAt: DateTime! @createdAt
  updatedAt: DateTime! @updatedAt
}
*/