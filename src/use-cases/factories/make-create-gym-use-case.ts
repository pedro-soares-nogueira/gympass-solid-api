import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository"
import { CheckInUseCase } from "../check-in"
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository"
import { CreateGymUseCase } from "../create-gym"

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const useCase = new CreateGymUseCase(gymsRepository)

  return useCase
}
