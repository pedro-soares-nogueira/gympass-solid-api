import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { CheckIn } from "@prisma/client"

interface FetchUsercheckInsRequest {
  userId: string
  page: number
}
interface FetchUserCheckInsResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUsercheckInsRequest): Promise<FetchUserCheckInsResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page
    )

    return { checkIns }
  }
}
