import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error"
import { FastifyReply, FastifyRequest } from "fastify"
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case"
import { z } from "zod"

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
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
