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

        console.log('User:', user);

        if (!user) {
            console.log('Unauthorized access attempt');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!device_id || !['true', 'false'].includes(status)) {
            console.log('Invalid request:', { device_id, status });
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        // Check if device exists and update its state
        const device = await prisma.device.findUnique({
            where: { id: device_id }
        });

        if (!device) {
            console.log('Device not found:', device_id);
            return NextResponse.json({ error: 'Device not found' }, { status: 404 });
        }

        console.log('Device found:', device);
        console.log('Current device status:', device.status);

        // Update device state
        await prisma.device.update({
            where: { id: device_id },
            data: { status: status === 'true' }
        });

        console.log('Device state updated:', { device_id, status });

        return NextResponse.json({ message: 'Device state updated', device_id, status: status === 'true' });
    } catch (error) {
        console.error('Error updating device state:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
