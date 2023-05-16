import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository"
import { describe } from "node:test"
import { beforeEach, expect, it } from "vitest"
import { GetUserProfileUseCase } from "./get-user-profile"
import { hash } from "bcryptjs"
import { ResourceNotFountError } from "./errors/resource-not-found-error"

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get user profile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it("should be able to get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password_hash: await hash("123456", 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual("John Doe")
  })

  it("should not be able to get user profile with wrong id", async () => {
    expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResourceNotFountError)
  })
})
