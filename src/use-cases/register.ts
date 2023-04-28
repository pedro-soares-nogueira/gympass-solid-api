import { prisma } from "@/lib/prisma"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"

interface RegisterUseCaseRequest {
  email: string
  name: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, name, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new Error("User already exists")
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
