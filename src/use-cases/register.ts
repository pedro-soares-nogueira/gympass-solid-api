import { PrismaUsersRepository } from "./../repositories/prisma-users-repository"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RegisterUseCaseRequest {
  email: string
  name: string
  password: string
}

export async function registerUseCase({
  email,
  name,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findFirst({
    where: {
      email,
    },
  })

  if (userWithSameEmail) {
    throw new Error("User already exists")
  }

  const prismaUsersRepository = new PrismaUsersRepository()
  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
