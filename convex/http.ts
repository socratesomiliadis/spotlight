import { httpRouter } from "convex/server"

import { createAuth, authComponent } from "./betterAuth/auth"

const http = httpRouter()

authComponent.registerRoutes(http, createAuth)

export default http
