import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GymsRepository } from "@/repositories/gyms-repository"
import { CheckIn } from "@prisma/client"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInsReposiroty: CheckInsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const checkInOnSameDate = await this.checkInsReposiroty.findByUserOnDate(
      userId,
      new Date()
    )

    if (checkInOnSameDate) {
      throw new Error()
    }

    const checkIn = await this.checkInsReposiroty.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
