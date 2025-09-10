import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://staging.cytechnology.ir/GoldPay/V0100101';

export async function GET(request: NextRequest, { params }: { params: { params: string[] } }) {
    return handleRequest(request, params);
}

export async function POST(request: NextRequest, { params }: { params: { params: string[] } }) {
    return handleRequest(request, params);
}

async function handleRequest(request: NextRequest, params: { params: string[] }) {
    try {
        const endpoint = params.params.join('/');
        const targetUrl = `${API_BASE}/${endpoint}`;

        // هدرهای request اصلی
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
            if (!['host', 'content-length'].includes(key)) {
                headers[key] = value;
            }
        });

        // --- مهم: body درست تبدیل شود ---
        let body: string | undefined = undefined;
        try {
            // سعی کن json بخونه
            const jsonBody = await request.json();
            body = JSON.stringify(jsonBody);
        } catch {
            // اگر json نبود، متن ساده
            body = await request.text();
        }

        // fetch به سرور اصلی
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: request.method !== 'GET' && request.method !== 'HEAD' ? body : undefined,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // هدرهای CORS
        const corsHeaders = {
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
        };

        return NextResponse.json(data, { status: response.status, headers: corsHeaders });

    } catch (error) {
        console.error('Proxy error:', error);

        return NextResponse.json(
            {
                message: 'Internal Server Error in proxy',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
