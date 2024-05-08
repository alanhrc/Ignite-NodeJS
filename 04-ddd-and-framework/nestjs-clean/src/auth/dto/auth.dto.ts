import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class AuthDto {
  @ApiProperty({ description: 'User e-mail', example: 'alan@alan.com' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(250)
  @Transform(({ value }) => value.toLowerCase())
  email!: string

  @ApiProperty({ description: 'User password', example: '123456' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  password!: string
}
