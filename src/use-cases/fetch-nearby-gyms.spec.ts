import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { describe, beforeEach, it, expect } from "vitest"
import { CreateGymUseCase } from "./create-gym"
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it("should be able to fecth nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: null,
      phone: null,
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

    await gymsRepository.create({
      title: "Far Gym",
      description: null,
      phone: null,
      latitude: -20.9085696,
      longitude: -51.3449449,
    })

    const { gyms } = await sut.execute({
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })])
  })
})
