"use server"

import { Resend } from 'resend';
const API_RESEND = process.env.API_RESEND;



export async function sendEmail(title:string,description:string) {
    const resend = new Resend(API_RESEND);
    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: 'alirazadev27@gmail.com',
        subject: title,
        html: `<p>${description}</p>`
    });
}