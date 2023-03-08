import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('Email already exists.')
    }
    const user = await prisma.user.create({
      data: data,
    })
    return user
  }
}
