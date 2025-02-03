// pages/api/smarthome.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

const prisma = new PrismaClient();
const io = new Server();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  
  // Google will send a JWT in the Authorization header
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split(' ')[1];
  
  // Verify the JWT using Google's library
  const { OAuth2Client } = require('google-auth-library');
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!userId || payload.sub !== userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Handle Google Smart Home intents
  const body = req.body;
  switch (body.inputs[0].intent) {
    case 'action.devices.SYNC':
      return handleSync(userId, res);
    case 'action.devices.EXECUTE':
      return handleExecute(userId, body, res);
    case 'action.devices.QUERY':
      return handleQuery(userId, body, res);
    default:
      res.status(400).json({ error: 'Invalid intent' });
  }
}

// SYNC: Return user's devices from Neon DB
async function handleSync(userId: string, res: NextApiResponse) {
  const devices = await prisma.device.findMany({
    where: { userId },
    select: { id: true, name: true, },
  });

  res.json({
    requestId: 'unique-request-id',
    payload: {
      devices: devices.map(device => ({
        id: device.id,
        type: 'action.devices.types.SWITCH',
        traits: ['action.devices.traits.OnOff'],
        name: { name: device.name },
        willReportState: true,
      })),
    },
  });
}

// EXECUTE: Toggle device state
async function handleExecute(userId: string, body: any, res: NextApiResponse) {
  const commands = body.inputs[0].payload.commands;
  for (const command of commands) {
    for (const device of command.devices) {
      const state = command.execution[0].params.on;
      
      // Update device state in Neon DB
      await prisma.device.update({
        where: { id: device.id, userId },
        data: { status: state ? true : false},
      });

      // Emit real-time update via Socket.io
      io.emit('device_update', { deviceId: device.id, state });
    }
  }

  res.json({ status: 'SUCCESS' });
}

// QUERY: Fetch device state (optional)
async function handleQuery(userId: string, body: any, res: NextApiResponse) {
  const devices = await prisma.device.findMany({
    where: { userId, id: { in: body.devices.map((d: any) => d.id) } },
  });

  res.json({
    devices: devices.reduce((acc, device) => ({
      ...acc,
      [device.id]: { on: device.status === true },
    }), {}),
  });
}