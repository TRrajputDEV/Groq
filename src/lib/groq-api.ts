export async function queryGroqAI({ message, reportContent }: { message: string; reportContent?: string }) {
    try {
        console.log('Sending request to /api/groq endpoint...');
        const res = await fetch('/api/groq', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, reportContent }),
            cache: 'no-store'
        });
        
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
            console.error('API response error:', res.status, errorData);
            throw new Error(`Failed to fetch from Groq API: ${res.status} ${errorData.error || ''}`);
        }
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error('Error in queryGroqAI:', error);
        throw error; // Re-throw to be handled by the component
    }
}

export async function extractTextFromDocument(file: File): Promise<string> {
    // For PDF files, we would need a PDF extraction library
    // For simplicity, treating all files as text-based for now
    if (file.type.includes('image')) {
        // For images, we'd need OCR which would require a different approach
        // Just returning a placeholder for now
        return "Image file detected. Text extraction from images requires OCR services.";
    }
    
    try {
        return await file.text();
    } catch (error) {
        console.error('File text extraction error:', error);
        return `Error extracting text from file: ${file.name}. Please try another file format.`;
    }
}