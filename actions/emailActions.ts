"use server"

import { Resend } from 'resend';
const API_RESEND = process.env.API_RESEND;



export async function sendEmail(formData: FormData) {
    const resend = new Resend(API_RESEND);
    const msg  = formData.get('msg');
    console.log(msg);
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'alirazadev27@gmail.com',
        subject: 'TESTING',
        html: `<p>Congrats on sending ${msg} your <strong>first email</strong>!</p>`
    });
}