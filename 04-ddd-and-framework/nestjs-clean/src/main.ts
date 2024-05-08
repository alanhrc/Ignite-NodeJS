import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Env } from './env'

async function bootstrap() {
  const logger = new Logger('Initial Log')

  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'fatal', 'warn', 'verbose'],
  })

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // TODO validate environment before
  const configSwagger = new DocumentBuilder()
    .setTitle('Messaging API')
    .setDescription('The messaging api routes')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('docs', app, document)

  const configService = app.get<ConfigService<Env, true>>(ConfigService)
  const port = configService.get('API_PORT', { infer: true })

  await app.listen(port)

  logger.debug(`Application is running on: ${await app.getUrl()}`)
}
bootstrap()
