import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { CheckIn } from "@prisma/client"

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInsReposiroty: CheckInsRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
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
