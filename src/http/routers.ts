import { FastifyInstance } from 'fastify'
import { register } from './controllers/regester'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
