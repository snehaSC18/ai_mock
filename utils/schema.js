import { pgTable , serial , text, varchar } from "drizzle-orm/pg-core";

export const MockInterview=pgTable('mockInterview',
    {
       id:serial('id').primaryKey(),
       jsonMockResp:text('jsonMockResp').notNull(),
        jobPosition:varchar('jobPosition').notNull(),
        jobDesc:varchar('jobDesc').notNull(),
        jobExp:varchar('jobExp').notNull(),
        createdBy:varchar('createdBy').notNull(),
        createdAt:varchar('createdAt'),
        mockId:varchar('mockId').notNull(),
       
    })
