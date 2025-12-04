import vine from '@vinejs/vine'

export const generateIdeaValidator = vine.compile(
  vine.object({
    age: vine.number().positive().max(150),
    tastes: vine.string().trim().minLength(3).maxLength(500),
    apiKey: vine.string().trim().minLength(4),
    provider: vine.enum(['openai', 'mistral']).optional(),
  })
)
