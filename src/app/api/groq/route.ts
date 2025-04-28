import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { message, reportContent } = await request.json();
        
        // Check if API key exists
        if (!process.env.GROQ_API_KEY) {
            console.error('GROQ_API_KEY is not defined in environment variables');
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }
        
        // Custom system prompt for medical report analysis
        let systemPrompt = 'You are DocToc, a helpful AI health assistant specializing in analyzing medical reports and explaining medical information in clear, simple terms.';
        
        if (reportContent) {
            systemPrompt += ' Your task is to analyze the provided medical report and explain the findings, potential concerns, and recommendations in easy-to-understand language. Focus on the most important aspects first, then provide additional context if needed. Always maintain a compassionate and helpful tone.';
        }
        
        // Prepare the user prompt
        let userPrompt = message;
        if (reportContent) {
            userPrompt = `${message}\n\nHere is the medical report content to analyze:\n${reportContent}`;
        }
        
        // Call Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Using Llama model
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: userPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
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