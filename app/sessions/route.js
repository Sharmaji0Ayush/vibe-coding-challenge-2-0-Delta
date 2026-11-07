import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.date || !body.sport || !body.attendance) {
      return NextResponse.json(
        { success: false, error: 'Missing required session parameters' },
        { status: 400 }
      );
    }

    const formattedAttendance = body.attendance
      .filter(item => item.player && mongoose.Types.ObjectId.isValid(item.player))
      .map(item => ({
        player: new mongoose.Types.ObjectId(item.player),
        status: item.status || 'PRESENT'
      }));

    const newSession = await Session.create({
      date: new Date(body.date),
      sport: body.sport,
      status: body.status || 'LOCKED',
      academy: 'Dumka Sports Academy',
      attendance: formattedAttendance
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error('Session API Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}