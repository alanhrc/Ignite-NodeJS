import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import * as request from 'supertest'
import { PrismaService } from '@/database/prisma/prisma.service'
import { hash } from 'bcryptjs'

describe('Authenticate user (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    const passwordHashed = await hash('123456', 8)

    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: passwordHashed,
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      // .set('Authorization', 'Bearer ' + accessToken)
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({ access_token: expect.any(String) })
  })
})
