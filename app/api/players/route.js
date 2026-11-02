import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role'); // SCOUT or COACH
  const targetPlayerId = searchParams.get('playerId'); // For PLAYER view

  // Fetch target players
  let query = { role: 'PLAYER' };
  if (targetPlayerId) query._id = targetPlayerId;

  const players = await User.find(query);

  // Compute readiness stats for each player
  const evaluatedPlayers = await Promise.all(
    players.map(async (player) => {
      const totalSessions = await Session.countDocuments({ sport: player.sport, status: 'LOCKED' });
      const attendedSessions = await Session.countDocuments({
        sport: player.sport,
        status: 'LOCKED',
        'attendance': { $elemMatch: { player: player._id, status: 'PRESENT' } }
      });

      const matchesPlayed = await Match.countDocuments({
        sport: player.sport,
        'playerScores.player': player._id
      });

      const attendancePct = totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0;
      const isReady = attendancePct >= 75 && matchesPlayed >= 2;

      return {
        _id: player._id,
        name: player.name,
        age: player.age,
        sport: player.sport,
        totalSessions,
        attendedSessions,
        attendancePct: Number(attendancePct.toFixed(1)),
        matchesPlayed,
        isReady
      };
    })
  );

  // If Scout role requested, filter to show ONLY ready players
  if (role === 'SCOUT') {
    const scoutData = evaluatedPlayers.filter((p) => p.isReady);
    return NextResponse.json({ success: true, data: scoutData });
  }

  return NextResponse.json({ success: true, data: evaluatedPlayers });
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();
  const newPlayer = await User.create({ ...body, role: 'PLAYER' });
  return NextResponse.json({ success: true, data: newPlayer });
}