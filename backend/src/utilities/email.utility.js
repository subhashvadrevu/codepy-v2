import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async(toEmail, otp, name) => {
    try {
        const res = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: toEmail,
            subject: 'Confirm your email and start coding on CodePy',
            html: 
            `
                <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px;">
                    <h2 style="color: #ff6900;">Verify your email address</h2>
                    
                    <p>Hello, ${name}.</p>

                    <p>To complete your registration on CodePy, please enter the following verification code:</p>

                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2a2a72;">${otp}</p>

                    <p>This code is valid for the next 15 minutes.</p>

                    <p>If you didn’t request this, you can safely ignore this email.</p>

                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">

                    <p style="font-size: 12px; color: #999;">CodePy Inc, Hyderabad, India.</p>
                </div>

            `,
        });

    console.log("Email sent: ", res);
    return res;
    } catch (error) {
        console.log("Error sending mail: ",error);
        return null;
    }  
};