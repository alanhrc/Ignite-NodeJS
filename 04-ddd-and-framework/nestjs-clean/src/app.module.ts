import { Module } from '@nestjs/common'
import { PrismaService } from './database/prisma/prisma.service'
import { CreateUserController } from './controllers/create-user.controller'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env'
import { AuthModule } from './auth/auth.module'
import { AuthenticateController } from './controllers/authenticate-controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [CreateUserController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
