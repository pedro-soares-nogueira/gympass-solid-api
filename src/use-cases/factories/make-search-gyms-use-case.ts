import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { CheckInUseCase } from "../check-in"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { CreateGymUseCase } from "../create-gym"
import { SearchGymsUseCase } from "../search-gyms"

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new SearchGymsUseCase(gymsRepository)

  return useCase
}
