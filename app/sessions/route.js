import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.date || !body.sport || !body.attendance) {
      return NextResponse.json({ success: false, error: 'Missing required session parameters' }, { status: 400 });
    }

    const newSession = await Session.create({
      date: new Date(body.date),
      sport: body.sport,
      status: body.status || 'LOCKED',
      academy: 'Dumka Sports Academy',
      attendance: body.attendance
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error('Session lock error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}