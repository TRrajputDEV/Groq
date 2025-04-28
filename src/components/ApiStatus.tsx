// src/components/ApiStatus.tsx
'use client';
import { useState, useEffect } from 'react';

export default function ApiStatus() {
    const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
    const [message, setMessage] = useState('Checking API connection...');

    useEffect(() => {
        async function checkApiStatus() {
            try {
                const res = await fetch('/api/test-groq');
                if (res.ok) {
                    const data = await res.json();
                    if (data.keyConfigured) {
                        setStatus('ok');
                        setMessage('API connection successful');
                    } else {
                        setStatus('error');
                        setMessage('API key not configured properly');
                    }
                } else {
                    setStatus('error');
                    setMessage('API endpoint error');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Failed to connect to API');
                console.error('API check error:', error);
            }
        }

        checkApiStatus();
    }, []);

    if (status === 'checking') {
        return <div className="text-sm text-yellow-500">Checking API connection...</div>;
    }

    if (status === 'error') {
        return <div className="text-sm text-red-500">⚠️ {message}</div>;
    }

    return <div className="text-sm text-green-500">✓ {message}</div>;
}