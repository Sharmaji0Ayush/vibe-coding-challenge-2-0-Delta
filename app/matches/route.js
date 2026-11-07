import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.date || !body.sport || !body.opponent) {
      return NextResponse.json({ success: false, error: 'Missing required match parameters' }, { status: 400 });
    }

    const newMatch = await Match.create({
      date: new Date(body.date),
      sport: body.sport,
      opponent: body.opponent,
      academy: 'Dumka Sports Academy',
      playerScores: body.playerScores || []
    });

    return NextResponse.json({ success: true, data: newMatch });
  } catch (error) {
    console.error('Match save error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}