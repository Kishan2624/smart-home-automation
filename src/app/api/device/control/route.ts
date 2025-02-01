import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { device_id, status } = await request.json();
        const apiKey = request.headers.get('api-key') ?? undefined;
        const apiSecret = request.headers.get('api-secret') ?? undefined;

        // Check API authentication
        const user = await prisma.user.findUnique({
            where: { apiKey, apiSecret }
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!device_id || !['true', 'false'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Check if device exists and update its state
        const device = await prisma.device.findUnique({
            where: { id: device_id }
        });

        if (!device) {
            return NextResponse.json({ error: 'Device not found' }, { status: 404 });
        }

        // Update device state
        await prisma.device.update({
            where: { id: device_id },
            data: { status: status === 'true' }
        });

        return NextResponse.json({ message: 'Device state updated', device_id, status: status === 'true' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const device_id = request.headers.get('device-id') ?? undefined;
        const apiKey = request.headers.get('api-key') ?? undefined;
        const apiSecret = request.headers.get('api-secret') ?? undefined;

        // Check API authentication
        const user = await prisma.user.findUnique({
            where: { apiKey, apiSecret }
        });

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!device_id) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Check if device exists
        const device = await prisma.device.findUnique({
            where: { id: device_id }
        });

        if (!device) {
            return NextResponse.json({ error: 'Device not found' }, { status: 404 });
        }

        return NextResponse.json({ device_id, status: device.status ? 'on' : 'off' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
