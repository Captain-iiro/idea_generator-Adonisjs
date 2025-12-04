import { HttpContext } from '@adonisjs/core/http'
import { NextFn } from '@adonisjs/core/types/http'

/**
 * Middleware pour les routes API
 * Permet les requêtes sans authentification
 */
export default class ApiMiddleware {
  handle(_ctx: HttpContext, next: NextFn) {
    console.log('API Middleware - bypassing auth checks')
    return next()
  }
}
