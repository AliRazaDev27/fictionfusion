import { v2 as cloudinary } from 'cloudinary';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});
export async function POST() {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");
    if (authToken && authToken.value) {
        const timestamp = Math.round(new Date().getTime() / 1000);
        // Generate the signature with required parameters
        const signature = cloudinary.utils.api_sign_request(
            { timestamp },
            process.env.API_SECRET as string
        );
        return NextResponse.json({
            signature,
            timestamp,
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
        });


    }
    return NextResponse.json({ success: false });
}