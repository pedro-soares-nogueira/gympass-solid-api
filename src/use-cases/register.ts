import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { UsersRepository } from "@/repositories/users-repository"
import { hash } from "bcryptjs"
import { User } from "@prisma/client"

interface RegisterUseCaseRequest {
  email: string
  name: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    name,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
