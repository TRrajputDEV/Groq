import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message, reportContent } = await req.json();
        const endpoint = process.env.NEXT_PUBLIC_GROK_API_ENDPOINT!;
        const apiKey = process.env.GROK_API_KEY!;

        if (!endpoint || !apiKey) {
            return NextResponse.json(
                { error: 'Missing API_ENDPOINT or API_KEY in env' },
                { status: 500 }
            );
        }

        const payload: any = { message };
        if (reportContent) payload.reportContent = reportContent;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify(payload),
        });

        // If Grok returns a non-2xx, grab its body
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Grok API Error:', response.status, errorText);
            return NextResponse.json(
                { error: errorText || 'Grok returned ' + response.status },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (e: any) {
        console.error('Route handler exception:', e);
        return NextResponse.json(
            { error: e.message || 'Unknown error' },
            { status: 500 }
        );
    }
}
