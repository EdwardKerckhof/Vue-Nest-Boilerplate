import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,PUT,POST,DELETE'
  })

  const config = new DocumentBuilder()
    .setTitle('BP API')
    .setDescription(
      'Docker NestJS boilerplate api with user authentication and authorization'
    )
    .setVersion('1.0')
    .addTag('boilerplate')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  await app.listen(process.env.PORT || 3000)
}
bootstrap()
