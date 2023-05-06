import { describe, expect, it, test } from "vitest"
import { RegisterUseCase } from "./register"
import { compare } from "bcryptjs"
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"

describe("Register Use Case", () => {
  it("shoud be abla to register", async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoae@example.com",
      password: "123456",
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it("shoud hash user password upen registration", async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoae@example.com",
      password: "123456",
    })

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it("shoud not be able to register with the same email twice", async () => {
    const userRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(userRepository)

    const email = "johndoe@example.com"

    await registerUseCase.execute({
      name: "John doe",
      email,
      password: "123456",
    })

    expect(() =>
      registerUseCase.execute({
        name: "John doe",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
