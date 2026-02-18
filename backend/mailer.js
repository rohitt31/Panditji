import nodemailer from 'nodemailer';
import logger from './logger.js';

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or 'hotmail', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send a confirmation email to the user
 */
export const sendConfirmationEmail = async (booking) => {
    if (!booking.email) {
        logger.warn('No email provided for booking, skipping confirmation email', { bookingId: booking.id });
        return;
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        logger.warn('Email credentials not set, skipping confirmation email');
        return;
    }

    const mailOptions = {
        from: `"Pandit Ji" <${process.env.EMAIL_USER}>`,
        to: booking.email,
        subject: `Booking Confirmed: ${booking.service}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #fdb931; padding: 20px; text-align: center;">
                    <h1 style="color: #000; margin: 0;">Booking Confirmed</h1>
                </div>
                <div style="padding: 20px; color: #333; line-height: 1.6;">
                    <p>Namaste <strong>${booking.name}</strong>,</p>
                    <p>We are pleased to confirm your booking for <strong>${booking.service}</strong>.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Date:</strong> ${booking.date || 'To be discussed'}</p>
                        <p style="margin: 5px 0;"><strong>Location:</strong> ${booking.location || 'To be discussed'}</p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: green; font-weight: bold;">Confirmed</span></p>
                    </div>

                    <p>Pandit Ji will be in touch with you shortly to discuss any further preparations required for the ceremony.</p>
                    
                    <p>Har Har Mahadev,<br/>
                    <strong>The Team</strong></p>
                </div>
                <div style="background-color: #f4f4f4; padding: 10px; text-align: center; font-size: 12px; color: #666;">
                    &copy; ${new Date().getFullYear()} Pandit Ji. All rights reserved.
                </div>
            </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info('Confirmation email sent', { messageId: info.messageId, bookingId: booking.id });
        return info;
    } catch (error) {
        logger.error('Failed to send confirmation email', error);
        throw error;
    }
};
