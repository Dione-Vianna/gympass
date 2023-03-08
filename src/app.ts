import fastify from 'fastify'

import { appRoutes } from './http/routers'

export const app = fastify()

app.register(appRoutes)
