import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './models/users.entity'
import { UsersService } from './service/users.service'
import { UsersController } from './controller/users.controller'
import { AuthModule } from '../auth/auth.module'
import { LocalStrategy } from './strategies/local.strategy'
import { RefreshStrategy } from './strategies/refresh.strategy'

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  providers: [UsersService, LocalStrategy, RefreshStrategy],
  controllers: [UsersController]
})
export class UsersModule {}
