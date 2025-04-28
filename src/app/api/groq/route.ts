import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, reportContent } = await request.json();
        
        // Check if API key exists
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not defined in environment variables');
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }
        
        // Prepare the complete prompt
        let prompt = message;
        if (reportContent) {
            prompt = `${message}\n\nHere is the medical report content to analyze:\n${reportContent}`;
        }
        
        console.log('Sending request to Groq API...');
        
        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Using a smaller model as fallback
                messages: [
                    {
                        role: 'system',
                        content: 'You are DocToc, a helpful AI health assistant. Provide clear, easy-to-understand explanations about medical information and reports.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            }),
            cache: 'no-store'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Groq API Error:', response.status, errorText);
            return NextResponse.json({ 
                error: `Failed to query Groq API: ${response.status} ${response.statusText}` 
            }, { status: 500 });
        }
        
        const data = await response.json();
        return NextResponse.json({ text: data.choices[0].message.content });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ 
            error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` 
        }, { status: 500 });
    }
}