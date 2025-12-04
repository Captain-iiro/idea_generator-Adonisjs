#!/usr/bin/env node

/**
 * Script de test pour l'API de génération d'idées cadeaux
 * Teste avec le mode démo (pas besoin de vraie clé API)
 */

const API_URL = 'http://localhost:3333/api/ideas'

async function testAPI() {
  console.log("🧪 Test de l'API de génération d'idées cadeaux\n")

  const testCases = [
    {
      name: 'Enfant de 10 ans qui aime les jeux vidéo',
      data: {
        age: 10,
        tastes: 'jeux vidéo, LEGO, aventure',
        apiKey: 'test-demo',
        provider: 'openai',
      },
    },
    {
      name: 'Adulte de 30 ans qui aime la technologie',
      data: {
        age: 30,
        tastes: 'technologie, gadgets, programmation',
        apiKey: 'test-demo',
        provider: 'openai',
      },
    },
  ]

  for (const testCase of testCases) {
    console.log(`📦 Test: ${testCase.name}`)
    console.log(`   Paramètres: age=${testCase.data.age}, tastes="${testCase.data.tastes}"`)

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      })

      const result = await response.json()

      if (result.success) {
        console.log('   ✅ Succès!')
        console.log(`   📋 ${result.data.ideas.length} idées générées:`)
        result.data.ideas.forEach((idea, index) => {
          console.log(`      ${index + 1}. ${idea}`)
        })
        console.log(`   🏷️  Provider: ${result.data.provider}`)
      } else {
        console.log(`   ❌ Erreur: ${result.error}`)
      }
    } catch (error) {
      console.log(`   ❌ Erreur de connexion: ${error.message}`)
    }

    console.log('')
  }

  console.log('✨ Tests terminés!\n')
}

testAPI()
