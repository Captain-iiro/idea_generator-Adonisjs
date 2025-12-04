import { useState } from 'react'
import { Head } from '@inertiajs/react'

interface GiftIdea {
  ideas: string[]
  provider: string
  timestamp: string
}

const Icons = {
  Gift: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-1.793M19 12a2 2 0 110-1.793"
      />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  ),
  Key: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  ),
  Chip: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
      />
    </svg>
  ),
}

export default function GiftGenerator() {
  const [age, setAge] = useState('')
  const [tastes, setTastes] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [provider, setProvider] = useState<'openai' | 'mistral'>('openai')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ideas, setIdeas] = useState<GiftIdea | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setValidationErrors({})
    setIdeas(null)

    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(age),
          tastes,
          apiKey,
          provider,
        }),
      })

      const contentType = response.headers.get('content-type')
      let result

      if (contentType?.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        console.error('Response is HTML:', text.substring(0, 500))
        setError('Erreur serveur: réponse invalide.')
        setLoading(false)
        return
      }

      if (!response.ok) {
        if (result.messages) {
          setValidationErrors(result.messages)
          setError('Veuillez vérifier les champs.')
        } else {
          setError(result.error || 'Une erreur est survenue')
        }
        return
      }

      if (result.success) {
        setIdeas(result.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head title="Générateur d'Idées Cadeaux" />

      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 pb-20">
        <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                <Icons.Gift />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">
                Gift<span className="text-indigo-600">Gen</span>
              </span>
            </div>
            <div className="text-sm font-medium text-slate-500">
              <a href="https://abdourahmanabdillahi.com/">Powered by Captain iiro</a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900 tracking-tight">
            Trouvez le cadeau{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              parfait
            </span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Laissez l'intelligence artificielle analyser les goûts et l'âge de vos proches pour
            dénicher des idées originales en quelques secondes.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Colonne Gauche : Formulaire */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="p-6 bg-gradient-to-b from-white to-slate-50">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600">
                      <Icons.Sparkles />
                    </span>
                    Préférences
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="group">
                      <label
                        htmlFor="age"
                        className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1"
                      >
                        Âge du destinataire
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Icons.User />
                        </div>
                        <input
                          id="age"
                          type="number"
                          min="0"
                          max="150"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="Ex: 25"
                          className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 ${validationErrors.age ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                          disabled={loading}
                        />
                      </div>
                      {validationErrors.age && (
                        <p className="text-xs text-red-600 mt-1 ml-1">{validationErrors.age[0]}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="tastes"
                        className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1"
                      >
                        Passions & Intérêts
                      </label>
                      <textarea
                        id="tastes"
                        value={tastes}
                        onChange={(e) => setTastes(e.target.value)}
                        placeholder="Ex: randonnée, cuisine italienne, science-fiction, jardinage..."
                        rows={4}
                        className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 resize-none ${validationErrors.tastes ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}
                        disabled={loading}
                      />
                      {validationErrors.tastes && (
                        <p className="text-xs text-red-600 mt-1 ml-1">
                          {validationErrors.tastes[0]}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                          Configuration IA
                        </span>
                        <button
                          type="button"
                          onClick={() => setApiKey('test-demo')}
                          className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium hover:bg-indigo-100 transition"
                        >
                          Mode Démo
                        </button>
                      </div>

                      <div className="mb-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Chip />
                          </div>
                          <select
                            id="provider"
                            value={provider}
                            onChange={(e) => setProvider(e.target.value as 'openai' | 'mistral')}
                            className="w-full pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none"
                            disabled={loading}
                          >
                            <option value="openai">OpenAI (GPT-3.5)</option>
                            <option value="mistral">Mistral AI</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Icons.Key />
                          </div>
                          <input
                            id="apiKey"
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="Clé API (sk-...)"
                            className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${validationErrors.apiKey ? 'border-red-300' : 'border-slate-200'}`}
                            disabled={loading}
                          />
                        </div>
                        {validationErrors.apiKey && (
                          <p className="text-xs text-red-600 mt-1">{validationErrors.apiKey[0]}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full relative group overflow-hidden rounded-xl bg-slate-900 text-white font-bold py-3.5 px-6 shadow-lg shadow-slate-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative flex items-center justify-center">
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Réflexion...
                          </>
                        ) : (
                          'Générer des Idées'
                        )}
                      </span>
                    </button>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              {!ideas ? (
                <div className="h-full min-h-[400px] flex flex-col justify-center items-center text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12">
                  <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-200">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">
                    En attente d'inspiration
                  </h3>
                  <p className="text-slate-500 max-w-sm">
                    Remplissez le formulaire à gauche pour lancer la recherche d'idées cadeaux.
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in-up">
                  <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-2xl font-bold text-slate-900">Suggestions pour vous</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                      IA: {ideas.provider === 'openai' ? 'OpenAI' : 'Mistral'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {ideas.ideas.map((idea, index) => (
                      <div
                        key={index}
                        className="group relative bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
                      >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-start gap-4">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {index + 1}
                          </span>
                          <p className="text-slate-700 font-medium leading-relaxed group-hover:text-slate-900">
                            {idea}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200 pt-6 px-2">
                    <p>
                      Généré le {new Date(ideas.timestamp).toLocaleDateString()} à{' '}
                      {new Date(ideas.timestamp).toLocaleTimeString()}
                    </p>
                    <button
                      onClick={() => setIdeas(null)}
                      className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline"
                    >
                      Effacer les résultats
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
