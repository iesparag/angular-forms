import nodemailer from 'nodemailer';
import env from '../config/config.js';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: env.EMAIL_USER,
                pass: env.EMAIL_PASSWORD
            }
        });
    }

    async sendEmail(to, subject, message, attachments = [], isBulk = false) {
        try {
            // Handle attachments (both Buffer and base64)
            const mailAttachments = attachments.map(attachment => {
                // If content is already a Buffer, use it directly
                if (Buffer.isBuffer(attachment.content)) {
                    return {
                        filename: attachment.filename || attachment.name,
                        content: attachment.content,
                        contentType: attachment.contentType || attachment.type
                    };
                }
                
                // If content is base64 string, convert to Buffer
                if (typeof attachment.content === 'string' && attachment.content.includes('base64')) {
                    const base64Data = attachment.content.split(',')[1] || attachment.content;
                    return {
                        filename: attachment.filename || attachment.name,
                        content: Buffer.from(base64Data, 'base64'),
                        contentType: attachment.contentType || attachment.type
                    };
                }
                
                // For other cases, use content as is
                return {
                    filename: attachment.filename || attachment.name,
                    content: attachment.content,
                    contentType: attachment.contentType || attachment.type
                };
            });

            // Process recipients
            const recipients = Array.isArray(to) ? to : to.split(',').map(email => email.trim());
            
            // Send individual emails to each recipient
            const results = await Promise.all(recipients.map(async (recipient) => {
                const mailOptions = {
                    from: `${env.APP_NAME} <${env.EMAIL_USER}>`,
                    to: recipient, // Send to individual recipient
                    subject,
                    html: message,
                    attachments: mailAttachments
                };

                try {
                    const info = await this.transporter.sendMail(mailOptions);
                    return { success: true, recipient };
                } catch (error) {
                    console.error(`Error sending email to ${recipient}:`, error);
                    return { success: false, recipient, error: error.message };
                }
            }));

            // Count successful sends
            const successful = results.filter(r => r.success);
            const failed = results.filter(r => !r.success);

            if (failed.length > 0) {
                console.error('Failed to send to some recipients:', failed);
            }

            return { 
                success: successful.length > 0,
                sentCount: successful.length,
                failedCount: failed.length,
                message: `Successfully sent to ${successful.length} out of ${recipients.length} recipients`
            };
        } catch (error) {
            console.error('Error in email service:', error);
            return { success: false, message: error.message };
        }
    }
}

export default new EmailService();
