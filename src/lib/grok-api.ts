export async function queryGrokAI({ message, reportContent }: { message: string; reportContent?: string }) {
    const res = await fetch('/api/grok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, reportContent }),
    });
    if (!res.ok) {
        throw new Error('Failed to fetch from Grok API');
    }
    const data = await res.json();
    return data;
}

export async function extractTextFromDocument(file: File): Promise<string> {
    return file.text();
}
