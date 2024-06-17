import nodemailer from 'nodemailer';
import env from '../../config/env'

// Function to send an email
async function sendEmail(message: string,toemailaddress:string): Promise<void> {
    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        auth: {
            user: env.email, //your email address
            pass: env.emailpassword,
        }
    });

    // Email message options
    const mailOptions = {
        from: env.email,
        to: toemailaddress,
        subject: 'verification mail',
        text: message
    };

    try {
        // Send mail
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}



// Function to send an email with HTML content
async function sendEmailWithHTML(htmlContent: string,toemailaddress:string,subject:string="verification mail"): Promise<void> {
    // Create a nodemailer transporter using SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port:465,
        auth: {
            user: env.email, //your email address
            pass: env.emailpassword,
        }
    });

    // Email message options
    const mailOptions = {
        from: env.email,
        to: toemailaddress,
        subject:subject ,
        html: htmlContent // Here we set the HTML content
    };

    try {
        // Send mail
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}


// const htmlMessage = `
//     <html>
//     <body>
//         <h1>This is a test HTML email</h1>
//         <p>Hello, this is a test email with <strong>HTML content</strong>!</p>
//     </body>
//     </html>
// `;

// sendEmailWithHTML(htmlMessage);

export {sendEmail,sendEmailWithHTML};
