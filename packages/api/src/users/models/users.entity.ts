import { UserDto, UserRole } from '@vnbp/common/dist/models'
import {
  BeforeUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert
} from 'typeorm'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  @Column({ unique: true })
  email!: string

  @Column({ nullable: true, select: false })
  refreshToken?: string

  @Column({ nullable: true, type: 'date' })
  refreshTokenExp?: string

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.USER]
  })
  roles!: UserRole[]

  // exclude password by default
  @Column({ select: false })
  password!: string

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
    this.firstName = this.firstName.toLowerCase()
    this.lastName = this.lastName.toLowerCase()
  }

  toDTO = (): UserDto => {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.toLowerCase(),
      refreshTokenExp: this.refreshTokenExp || '',
      roles: this.roles
    }
  }
}
