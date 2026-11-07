// app/api/players/route.js
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Session from '@/models/Session';
import Match from '@/models/Match';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const targetPlayerId = searchParams.get('playerId');

    let query = { role: 'PLAYER' };
    if (targetPlayerId) query._id = targetPlayerId;

    const players = await User.find(query).lean();

    const evaluatedPlayers = await Promise.all(
      players.map(async (player) => {
        const lockedSessions = await Session.countDocuments({ sport: player.sport, status: 'LOCKED' });
        const attendedSessions = await Session.countDocuments({
          sport: player.sport,
          status: 'LOCKED',
          'attendance': { $elemMatch: { player: player._id, status: 'PRESENT' } }
        });

        const matchesPlayed = await Match.countDocuments({
          sport: player.sport,
          'playerScores.player': player._id
        });

        const attendancePct = lockedSessions > 0 ? Math.round((attendedSessions / lockedSessions) * 100) : 0;
        const isReady = attendancePct >= 75 && matchesPlayed >= 2;

        return {
          id: player._id.toString(),
          name: player.name,
          age: player.age,
          sport: player.sport,
          academy: player.academy || 'Dumka Sports Academy',
          totalSessions: lockedSessions,
          attendedSessions,
          attendancePercentage: attendancePct,
          matchesPlayed,
          isReady
        };
      })
    );

    if (role === 'SCOUT') {
      const scoutData = evaluatedPlayers.filter((p) => p.isReady);
      return NextResponse.json({ success: true, data: scoutData });
    }

    return NextResponse.json({ success: true, data: evaluatedPlayers });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.age || !body.sport) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newPlayer = await User.create({
      name: body.name,
      age: Number(body.age),
      sport: body.sport,
      role: 'PLAYER',
      academy: 'Dumka Sports Academy',
      email: `${body.name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@dumka.org`,
      password: 'defaultPassword123'
    });

    return NextResponse.json({
      success: true,
      data: {
        id: newPlayer._id.toString(),
        name: newPlayer.name,
        age: newPlayer.age,
        sport: newPlayer.sport,
        academy: newPlayer.academy,
        totalSessions: 0,
        attendedSessions: 0,
        attendancePercentage: 0,
        matchesPlayed: 0,
        isReady: false
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}