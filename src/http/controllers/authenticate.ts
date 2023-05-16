import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { PrismaUsersRepository } from "../../repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "@/use-cases/register"
import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import { AuthenticateUseCase } from "@/use-cases/authenticate"

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const registerBodyschema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = registerBodyschema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
