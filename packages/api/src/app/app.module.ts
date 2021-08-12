import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from '../auth/auth.module'
import { UsersModule } from '../users/users.module'
import { DatabaseModule } from '../db/database.module'
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
    DatabaseModule,
    AuthModule,
    UsersModule
  ]
})
export class AppModule {}
