import 'dotenv/config'

import { PrismaClient } from '@prisma/client'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, unlinkSync } from 'node:fs'
import { UnauthorizedException } from '@nestjs/common'

const prisma = new PrismaClient()

function generateUniqueDatabaseURL(schemaId: string) {
  if (!process.env.DATABASE_URL) {
    throw new UnauthorizedException('Provider DATABASE_URL environment value.')
  }

  if (!process.env.DATABASE_PROVIDER) {
    throw new UnauthorizedException(
      'Provider DATABASE_PROVIDER environment value.',
    )
  }

  if (process.env.DATABASE_PROVIDER === 'postgresql') {
    const url = new URL(process.env.DATABASE_URL)
    url.searchParams.set('schema', schemaId)
    return url.toString()
  }

  const url = `file:./database/${schemaId}.db`

  return url
}

const schemaId = randomUUID()

beforeAll(async () => {
  process.env.DATABASE_URL = generateUniqueDatabaseURL(schemaId)
  process.env.NODE_ENV = 'test'

  execSync(
    `DATABASE_URL=${generateUniqueDatabaseURL(schemaId)} npx prisma migrate deploy`,
  )
})

afterAll(async () => {
  if (process.env.DATABASE_PROVIDER === 'postgresql') {
    await prisma.$executeRawUnsafe(
      `DROP SCHEMA IF EXISTIS "${schemaId}" CASCADE`,
    )

    await prisma.$disconnect()
    return
  }

  const dbPath = `${process.cwd()}/prisma/database/${schemaId}.db`
  const dbJournalPath = `${process.cwd()}/prisma/database/${schemaId}.db-journal`

  if (existsSync(dbPath)) {
    unlinkSync(dbPath)
  }

  if (existsSync(dbJournalPath)) {
    unlinkSync(dbJournalPath)
  }

  await prisma.$disconnect()
})
