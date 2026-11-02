import dbConnect from '@/lib/dbConnect';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  const body = await request.json(); // { date, sport, opponent, playerScores: [{ player, score }] }
  const matchRecord = await Match.create(body);
  return NextResponse.json({ success: true, data: matchRecord });
}