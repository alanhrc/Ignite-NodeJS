import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import * as request from 'supertest'
import { PrismaService } from '@/database/prisma/prisma.service'

describe('Create user (E2E)', () => {
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

  test('[POST] /users', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      // .set('Authorization', 'Bearer ' + accessToken)
      .send({
        name: 'John Doe',
        email: 'johnDoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
