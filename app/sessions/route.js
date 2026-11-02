import dbConnect from '@/lib/dbConnect';
import Session from '@/models/Session';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();
  const body = await request.json(); // { date, sport, attendance }
  const session = await Session.create(body);
  return NextResponse.json({ success: true, data: session });
}

export async function PATCH(request) {
  await dbConnect();
  const { sessionId, status, attendance } = await request.json();
  
  const updateData = {};
  if (status) updateData.status = status;
  if (attendance) updateData.attendance = attendance;

  const updatedSession = await Session.findByIdAndUpdate(sessionId, updateData, { new: true });
  return NextResponse.json({ success: true, data: updatedSession });
}