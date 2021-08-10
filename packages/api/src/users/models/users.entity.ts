import { UserDto } from '@vnbp/common/dist/models'
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'

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

  @Column({ nullable: true, select: false })
  refreshTokenExp?: Date

  // exclude password by default
  @Column({ select: false })
  password!: string

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase()
  }

  toDTO = (): UserDto => {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email.toLowerCase()
    }
  }
}
