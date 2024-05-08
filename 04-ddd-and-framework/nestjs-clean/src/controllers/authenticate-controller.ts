import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { PrismaService } from '@/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
// import { z } from 'zod'
// import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
import { compare } from 'bcryptjs'
import { authSchemaResponse } from '@/auth/auth.swagger'
import { AuthDto } from '@/auth/dto/auth.dto'

// const authenticateUserBodySchema = z.object({
//   email: z.string().email(),
//   password: z.string(),
// })

// type AuthenticateUserBodySchema = z.infer<typeof authenticateUserBodySchema>

@ApiTags('Sessions')
@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @ApiOperation({ summary: 'Authenticate user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User access token created',
    schema: authSchemaResponse.signIn,
  })
  @ApiUnauthorizedResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User credentials does not match.',
    schema: authSchemaResponse.default,
  })
  @Post()
  @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(authenticateUserBodySchema))
  // async handler(@Body() body: AuthenticateUserBodySchema) {
  async handler(@Body() body: AuthDto) {
    let { email, password } = body
    email = email.toLowerCase()

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials does not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials does not match.')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return {
      access_token: accessToken,
    }
  }
}
