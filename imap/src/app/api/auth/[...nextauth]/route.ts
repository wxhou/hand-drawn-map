import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ expires: new Date(Date.now() + 86400 * 1000).toISOString() });
}

export async function POST() {
  return NextResponse.json({ expires: new Date(Date.now() + 86400 * 1000).toISOString() });
}
