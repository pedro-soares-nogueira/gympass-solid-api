import { GymsRepository } from "@/repositories/gyms-repository"
import { Gym } from "@prisma/client"

interface FecthNearbyGymsRequest {
  userLatitude: number
  userLongitude: number
}
interface FecthNearbyGymsResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FecthNearbyGymsRequest): Promise<FecthNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
