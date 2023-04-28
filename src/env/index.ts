import "dotenv/config"
import { z } from "zod"

const schema = z.object({
  NODE_ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
})
const _env = schema.safeParse(process.env)

if (_env.success === false) {
  console.error("Invalid enviroment variables", _env.error.format())

  throw new Error("Invalid enviroment variables (error)")
}

export const env = _env.data
