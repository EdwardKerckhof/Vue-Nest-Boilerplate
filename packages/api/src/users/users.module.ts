import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './models/users.entity'
import { UsersService } from './service/users.service'
import { UsersController } from './controller/users.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
