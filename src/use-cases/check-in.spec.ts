import { CheckIn } from "@prisma/client"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { beforeEach, describe, it } from "vitest"
import { CheckInUseCase } from "./check-in"

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Check In Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    })
  })
})
