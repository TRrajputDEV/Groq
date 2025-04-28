// src/app/api/test-groq/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Basic test to check if the Groq API key is configured
        const apiKey = process.env.GROQ_API_KEY;
        
        return NextResponse.json({ 
            status: 'API endpoint responding',
            keyConfigured: !!apiKey,
            keyFirstChars: apiKey ? `${apiKey.substring(0, 3)}...` : 'None'
        });
    } catch (error) {
        console.error('Error in test endpoint:', error);
        return NextResponse.json({ error: 'Test endpoint error' }, { status: 500 });
    }
}