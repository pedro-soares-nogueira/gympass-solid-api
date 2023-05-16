import { CheckIn } from "@prisma/client"
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { CheckInUseCase } from "./check-in"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime/library"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Check In Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()

    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: "gym-01",
      title: "JavaScript",
      description: "JavaScript",
      phone: "",
      latitude: 21.2259943,
      longitude: 50.4411536,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 21.2259943,
      userLongitude: 50.4411536,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in twice a day", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 21.2259943,
      userLongitude: 50.4411536,
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-01",
        userId: "user-01",
        userLatitude: 21.2259943,
        userLongitude: 50.4411536,
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it("should be able to check in twice in different days", async () => {
    vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 21.2259943,
      userLongitude: 50.4411536,
    })

    vi.setSystemTime(new Date(2023, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: 21.2259943,
      userLongitude: 50.4411536,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it("should not be able to check in on distante gym", async () => {
    gymsRepository.items.push({
      id: "gym-02",
      title: "JavaScript",
      description: "JavaScript",
      phone: "",
      latitude: new Decimal(21.2937258),
      longitude: new Decimal(50.3504117),
    })

    await expect(() =>
      sut.execute({
        gymId: "gym-02",
        userId: "user-01",
        userLatitude: 21.2259943,
        userLongitude: 50.4411536,
      })
    ).rejects.toBeInstanceOf(Error)
  })
})
