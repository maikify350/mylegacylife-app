interface LanguageToolMatch {
    message: string
    shortMessage: string
    offset: number
    length: number
    replacements: Array<{ value: string }>
    rule: {
        id: string
        description: string
        category: { id: string; name: string }
    }
}

interface LanguageToolResponse {
    matches: LanguageToolMatch[]
}

export async function checkGrammar(text: string): Promise<LanguageToolMatch[]> {
    console.log('=== LanguageTool FREE API ===')
    console.log('Text to check:', text)

    try {
        // Use FREE public API endpoint (no auth required)
        const formData = new URLSearchParams()
        formData.append('text', text)
        formData.append('language', 'en-US')

        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
            },
            body: formData.toString(),
        })

        console.log('Response status:', response.status)

        const responseText = await response.text()
        console.log('Response received')

        if (!response.ok) {
            console.error('API ERROR:', response.status, responseText)
            throw new Error(`API error: ${response.statusText}`)
        }

        const data: LanguageToolResponse = JSON.parse(responseText)
        console.log('Found', data.matches?.length || 0, 'issues')

        return data.matches || []
    } catch (error) {
        console.error('Grammar check error:', error)
        return []
    }
}
