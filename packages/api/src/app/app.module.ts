import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import Joi from '@hapi/joi'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        DATABASE_ADMIN_EMAIL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
        COOKIE_NAME: Joi.string().required(),
        PORT: Joi.number()
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true
    }),
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
