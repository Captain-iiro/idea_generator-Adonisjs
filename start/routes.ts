/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('gift_generator')

router.post('/api/ideas', async ({ request, response }) => {
  try {
    const aiServiceModule = await import('#services/ai_service')
    const AiService = aiServiceModule.AiService

    const body = request.all()
    const age = Number.parseInt(body.age)
    const tastes = String(body.tastes || '').trim()
    const apiKey = String(body.apiKey || '').trim()
    const provider = String(body.provider || 'openai')

    // Validations
    if (!age || age < 0 || age > 150) {
      return response.status(400).json({
        success: false,
        error: 'Age must be between 0 and 150',
      })
    }

    if (!tastes || tastes.length < 3) {
      return response.status(400).json({
        success: false,
        error: 'Tastes must be at least 3 characters',
      })
    }

    if (!apiKey || apiKey.length < 4) {
      return response.status(400).json({
        success: false,
        error: 'API Key is required and must be at least 4 characters',
      })
    }

    if (!['openai', 'mistral'].includes(provider)) {
      return response.status(400).json({
        success: false,
        error: 'Provider must be openai or mistral',
      })
    }

    // Appeler le service IA
    const ideas = await AiService.generateGiftIdeas({
      age,
      tastes,
      apiKey,
      provider: provider as 'openai' | 'mistral',
    })

    // Retourner les idées
    return response.json({
      success: true,
      data: ideas,
    })
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return response.status(500).json({
      success: false,
      error: errorMessage,
    })
  }
})
