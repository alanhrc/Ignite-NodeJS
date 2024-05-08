import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  // UseGuards,
  UsePipes,
} from '@nestjs/common'
import {
  ApiOperation,
  ApiTags,
  ApiNoContentResponse,
  ApiConflictResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { hash } from 'bcryptjs'
import { PrismaService } from '@/database/prisma/prisma.service'
import { z } from 'zod'
import { ZodValidationPipe } from '@/pipes/zod-validation.pipe'
// import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
// import { AuthUser } from '@/auth/auth-user.decorator'
// import { UserPayload } from '@/auth/strategy/jwt.strategy'

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

type CreateUserBodySchema = z.infer<typeof createUserBodySchema>

@ApiTags('Users')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@Controller('users')
export class CreateUserController {
  constructor(private readonly prisma: PrismaService) {}

  @ApiOperation({ summary: 'Create users' })
  @ApiNoContentResponse({ status: 204, description: 'User created' })
  @ApiConflictResponse({
    status: 409,
    description: 'User with same e-mail address already exists.',
  })
  @Post()
  @HttpCode(204)
  @UsePipes(new ZodValidationPipe(createUserBodySchema))
  async handler(
    // @AuthUser() user: UserPayload,
    @Body() body: CreateUserBodySchema,
  ) {
    // console.log({ user })

    let { name, email, password } = createUserBodySchema.parse(body)
    email = email.toLowerCase()

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      )
    }

    const passwordHashed = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: passwordHashed,
      },
    })
  }
}
