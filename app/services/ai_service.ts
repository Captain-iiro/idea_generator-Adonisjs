import OpenAI from 'openai'
import axios from 'axios'

export interface IdeaGeneratorOptions {
  age: number
  tastes: string
  apiKey: string
  provider?: 'openai' | 'mistral'
}

export interface IdeaResponse {
  ideas: string[]
  provider: string
  timestamp: string
}

export class AiService {
  /**
   * Génère des idées cadeaux en interrogant OpenAI ou Mistral
   * N'enregistre jamais l'API Key - elle est fournie à chaque requête
   */
  static async generateGiftIdeas(options: IdeaGeneratorOptions): Promise<IdeaResponse> {
    const provider = options.provider || 'openai'

    // Mode démo si la clé commence par "test"
    if (options.apiKey.startsWith('test')) {
      return this.generateDemo(provider, options.age, options.tastes)
    }

    if (provider === 'openai') {
      return this.generateWithOpenAI(options)
    } else if (provider === 'mistral') {
      return this.generateWithMistral(options)
    }

    throw new Error(`Provider ${provider} not supported`)
  }

  /**
   * Génère des idées en mode démo (pour tester sans API réelle)
   */
  private static generateDemo(provider: string, age: number, _tastes: string): IdeaResponse {
    const demoIdeas: Record<string, string[]> = {
      kid: [
        'Ensemble de construction LEGO Star Wars',
        'Scooter électrique pour enfants',
        'Console Nintendo Switch',
        'Skateboard personnalisé',
        'Kit de création de bijoux',
      ],
      teen: [
        'AirPods Pro',
        'Montre connectée Samsung Galaxy',
        'Appareil photo instantané Fujifilm',
        'Lampe LED RGB programmable',
        'Casque gaming sans fil',
      ],
      adult: [
        'Cafetière connectée SCAA',
        'Barre de son Sonos',
        'Smartwatch premium',
        'Drone 4K DJI',
        'Enceinte portable JBL',
      ],
      elderly: [
        'Tablette tactile facile à utiliser',
        'Liseuse Kindle',
        "Système d'alarme connecté",
        'Miroir connecté avec affichage',
        'Enregistreur de recettes vocales',
      ],
    }

    let category = 'adult'
    if (age < 13) category = 'kid'
    else if (age < 18) category = 'teen'
    else if (age > 65) category = 'elderly'

    // Mélanger les idées pour plus de variation
    const ideas = demoIdeas[category] || demoIdeas.adult
    const shuffled = ideas.sort(() => Math.random() - 0.5).slice(0, 5)

    return {
      ideas: shuffled,
      provider: `${provider} (DEMO)`,
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Interroge OpenAI pour générer des idées cadeaux
   */
  private static async generateWithOpenAI(options: IdeaGeneratorOptions): Promise<IdeaResponse> {
    const prompt = this.buildPrompt(options.age, options.tastes)

    try {
      // Créer une instance du client OpenAI avec la clé API
      const openai = new OpenAI({
        apiKey: options.apiKey,
      })

      // Appeler l'API avec le SDK officiel
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'Vous êtes un générateur d idées cadeaux. Vous devez répondre uniquement avec un JSON valide..',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 500,
      })

      const content = completion.choices[0].message.content
      if (!content) {
        throw new Error('No content in OpenAI response')
      }

      const ideas = this.parseOpenAIJsonResponse(content)

      return {
        ideas,
        provider: 'openai',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      // Gestion des erreurs spécifiques à OpenAI
      if (error instanceof OpenAI.APIError) {
        console.error('OpenAI API Error Details:', {
          status: error.status,
          message: error.message,
          code: error.code,
          type: error.type,
        })

        if (error.status === 401) {
          throw new Error('Clé API OpenAI invalide. Vérifiez votre clé sur platform.openai.com')
        }
        if (error.status === 429) {
          const errorType = error.type || 'unknown'
          if (errorType === 'insufficient_quota') {
            throw new Error(
              'Quota OpenAI épuisé. Ajoutez des crédits sur platform.openai.com/settings/organization/billing'
            )
          } else if (errorType === 'rate_limit_exceeded') {
            throw new Error('Limite de taux dépassée. Attendez quelques secondes et réessayez.')
          } else {
            throw new Error(
              `Erreur 429 OpenAI: ${error.message || 'Quota dépassé ou trop de requêtes'}`
            )
          }
        }
        if (error.status === 403) {
          throw new Error(
            "Accès refusé. Votre clé API n'a peut-être pas les permissions nécessaires"
          )
        }
        throw new Error(`Erreur API OpenAI: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Interroge Mistral pour générer des idées cadeaux
   */
  private static async generateWithMistral(options: IdeaGeneratorOptions): Promise<IdeaResponse> {
    const prompt = this.buildPrompt(options.age, options.tastes)

    try {
      const response = await axios.post(
        'https://api.mistral.ai/v1/chat/completions',
        {
          model: 'mistral-small',
          messages: [
            {
              role: 'system',
              content:
                'Vous êtes un générateur d idées cadeaux. Répondez avec un tableau JSON d idées cadeaux.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${options.apiKey}`,
          },
          timeout: 15000,
        }
      )

      const content = response.data.choices[0].message.content
      const ideas = this.parseJsonResponse(content)

      return {
        ideas,
        provider: 'mistral',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new Error('Clé API Mistral invalide. Vérifiez votre clé sur console.mistral.ai')
        }
        if (error.response?.status === 429) {
          throw new Error(
            'Quota Mistral dépassé ou trop de requêtes. Vérifiez vos crédits sur console.mistral.ai'
          )
        }
        if (error.response?.status === 403) {
          throw new Error(
            "Accès refusé. Votre clé API n'a peut-être pas les permissions nécessaires"
          )
        }
        throw new Error(`Erreur API Mistral: ${error.message}`)
      }
      throw error
    }
  }

  /**
   * Construit le prompt pour la génération d'idées
   */
  private static buildPrompt(age: number, tastes: string): string {
    return `Générez 5 idées de cadeaux uniques et originales pour une personne âgée de ${age} ans et ayant les centres d'intérêt suivants: ${tastes}.

Renvoie un objet JSON contenant un tableau "ideas" avec les idées de cadeaux. Exemple de format:

{"ideas": ["idea1", "idea2", "idea3", "idea4", "idea5"]}

N'ajoutez aucun texte ni explication supplémentaire.`
  }

  /**
   * Parse la réponse JSON de l'API OpenAI (format objet avec clé "ideas")
   */
  private static parseOpenAIJsonResponse(content: string): string[] {
    try {
      const parsed = JSON.parse(content)

      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Response is not a valid JSON object')
      }

      if (!Array.isArray(parsed.ideas)) {
        throw new Error('Response does not contain an "ideas" array')
      }

      // Filtre et valide les strings
      return parsed.ideas
        .filter((item: any) => typeof item === 'string' && item.trim().length > 0)
        .slice(0, 10)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to parse OpenAI response: ${errorMsg}`)
    }
  }

  /**
   * Parse la réponse JSON de l'API (format array pour Mistral)
   */
  private static parseJsonResponse(content: string): string[] {
    try {
      // Cherche le array JSON dans le contenu
      const jsonMatch = content.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No JSON array found in response')
      }

      const parsed = JSON.parse(jsonMatch[0])
      if (!Array.isArray(parsed)) {
        throw new Error('Response is not an array')
      }

      // Filtre et valide les strings
      return parsed
        .filter((item) => typeof item === 'string' && item.trim().length > 0)
        .slice(0, 10)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to parse AI response: ${errorMsg}`)
    }
  }
}
