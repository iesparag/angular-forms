import emailService from '../utils/emailService.js';

export const sendEmail = async (req, res) => {
    try {
        const { to, subject, message, bulk = false } = req.body;
        
        // Validate required fields
        if (!to || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: to, subject, or message'
            });
        }

        // Process recipients
        const recipients = Array.isArray(to) ? to : to.split(',').map(email => email.trim());
        
        // Validate recipient count
        if (recipients.length > 200) {
            return res.status(400).json({
                success: false,
                message: 'Maximum 200 recipients allowed per request'
            });
        }

        // Process file attachments from multer
        const attachments = [];
        let totalSize = 0;
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                totalSize += file.size;
                console.log(`File ${file.originalname} size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
                attachments.push({
                    filename: file.originalname,
                    content: file.buffer,  // This is already a Buffer
                    contentType: file.mimetype
                });
            }
            console.log(`Total attachments size: ${(totalSize / (1024 * 1024)).toFixed(2)}MB`);
            
            // Gmail has a 25MB limit
            if (totalSize > 25 * 1024 * 1024) {
                return res.status(400).json({
                    success: false,
                    message: 'Total attachments size exceeds Gmail\'s 25MB limit'
                });
            }
        }

        // Send email using the email service
        const result = await emailService.sendEmail(recipients, subject, message, attachments, bulk);

        if (result.success) {
            res.status(200).json({
                ...result,
                sentCount: recipients.length
            });
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        console.error('Email controller error:', error);
        res.status(500).json({
            success: false,
            message: `Server error while sending email: ${error.message}`
        });
    }
};
