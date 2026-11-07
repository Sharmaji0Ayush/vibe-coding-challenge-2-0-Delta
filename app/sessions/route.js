import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newSession = await Session.create(body);
    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}