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
        { success: false, error: 'Missing required fields (date, sport, attendance)' },
        { status: 400 }
      );
    }

    // Convert string dates safely
    const sessionDate = new Date(body.date);

    // Format and validate attendance array
    const formattedAttendance = body.attendance
      .filter(item => item.player && mongoose.Types.ObjectId.isValid(item.player))
      .map(item => ({
        player: new mongoose.Types.ObjectId(item.player),
        status: item.status || 'PRESENT'
      }));

    const newSession = await Session.create({
      date: sessionDate,
      sport: body.sport,
      status: body.status || 'LOCKED',
      academy: 'Dumka Sports Academy',
      attendance: formattedAttendance
    });

    return NextResponse.json({ success: true, data: newSession });
  } catch (error) {
    console.error('Session lock server error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}