const { AppConfig } = require("../../config/config");
const EmailService = require("../../services/email.service");

class AuthMail extends EmailService {
    async sendRegisterSuccessMail(user) {
        try {
            return await this.emailSend({
                to: user.email,
                subject: "Activate your Account!",
                message: ` <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="padding: 30px 20px; background: linear-gradient(135deg, #0d2b3e 0%, #1a5276 100%); text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome Aboard!</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 10px 0 0; font-size: 16px;">Your journey begins here</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 20px;">
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">Dear ${user.name},</p>
            
            <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">
                Thank you for joining our platform! We're excited to have you as part of our community of innovators and visionaries.
            </p>
            
            <div style="background-color: #f0f7ff; padding: 20px; border-left: 4px solid #1a5276; margin-bottom: 25px; border-radius: 0 4px 4px 0;">
                <p style="color: #1a5276; font-size: 16px; margin: 0; font-style: italic;">
                    "The future belongs to those who believe in the beauty of their dreams." 
                    <br><span style="font-weight: 600;">- Eleanor Roosevelt</span>
                </p>
            </div>
            
            <p style="color: #333333; font-size: 16px; margin-bottom: 25px;">
                We've built this platform to help you turn your ideas into reality. Your first step is to activate your account and begin exploring all the possibilities waiting for you.
            </p>
            
            <!-- Activation Button -->
            <div style="margin-bottom: 30px; text-align: center;">
                <a href="${AppConfig.feUrl}/activate/${user.activationToken}" style="background: linear-gradient(to right, #1a5276, #0d2b3e); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(26, 82, 118, 0.3);">
                    Activate Your Account
                </a>
            </div>
            
            <p style="color: #666666; font-size: 14px; margin-bottom: 0;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <span style="color: #1a5276; word-break: break-all;">${AppConfig.feUrl}/activate/${user.activationToken}</span>
            </p>
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px; background-color: #0d2b3e; text-align: center; color: #a0b3c0; font-size: 12px;">
            <p style="margin: 0 0 10px 0;">Note: Do not reply to this email directly.</p>
            <p style="margin: 0 0 10px 0;">© 2023 BinCommerce. All rights reserved.</p>
            <div style="margin-top: 15px;">
                <a href="#" style="color: #a0b3c0; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
                <a href="#" style="color: #a0b3c0; text-decoration: none; margin: 0 10px;">Terms</a>
                <a href="#" style="color: #a0b3c0; text-decoration: none; margin: 0 10px;">Support</a>
            </div>
        </div>
    </div>`
            })

        } catch (exception) {
            throw exception
        }
    }
    async sendActivationSuccessNotification(activatedUser) {
        try {
            return await this.emailSend({
                to: activatedUser.email,
                subject: "Account activated successfully!!",
                message: `
                <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px; border-radius: 10px; color: #333; max-width: 600px; margin: auto;">
                    <h2 style="color: #2c3e50;">🎉 Welcome to Our Community!</h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                    Dear <strong>${activatedUser.name}</strong>,<br><br>
                    We're thrilled to announce that your account has been successfully activated!
                    <p style="font-size: 16px; line-height: 1.6;">
                        We're thrilled to have you on board! Your journey starts here, and we're excited to see where it takes you.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                        Every step you take now is a step toward something greater—believe in your potential, and trust the process.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                        You are now part of a community that values growth, positivity, and perseverance. You're never alone on this path.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                        Remember, success is not final, failure is not fatal—it is the courage to continue that counts.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                        Stay curious, stay inspired, and most importantly—stay true to yourself. Great things are ahead!
                    </p>
                    <p style="font-size: 16px; line-height: 1.6; margin-top: 20px;">
                        🙏 <strong>Thank you</strong> for joining us. We're honored to be part of your journey.
                    </p>
                    <a href="${AppConfig.feUrl}/login" 
                        style="display: inline-block; margin-top: 20px; padding: 12px 20px; background-color: #27ae60; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        🔐 Login to Your Account
                    </a>
                </div>
            `
            })

        } catch (exception) {
            throw exception
        }
    }
   
    async resetPasswordRequestNotification(user) {
        try {
            return await this.emailSend({
                to: user.email,
                subject: "** Forget Password Request **",
                message: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
                <!-- Header with Gradient Background -->
                <div style="background: linear-gradient(135deg, #6e8efb, #a777e3); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Hello,</p>
                    <p style="color: #333333; font-size: 16px; margin-bottom: 20px;">Dear ${user.name},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">We received a request to reset your password. Click the button below to set a new password:</p>
                    
                    <!-- Reset Button - FIXED: Use query parameter instead of path parameter -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${AppConfig.feUrl}/reset-password?token=${user.forgetToken}" style="background: linear-gradient(to right, #1a5276, #0d2b3e); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(26, 82, 118, 0.3);">
                            Reset Your Password
                        </a>
                    </div>
                    
                    <!-- Expiry Notice -->
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                        <p style="font-size: 14px; color: #666; line-height: 1.6; margin: 0;">
                            This link will expire in 3 hours for security reasons.
                        </p>
                    </div>
                    
                    <!-- Alternative Link -->
                    <p style="font-size: 14px; color: #666; line-height: 1.6;">
                        If the button doesn't work, copy and paste this link into your browser:<br>
                        <span style="color: #1a5276; word-break: break-all;">${AppConfig.feUrl}/reset-password?token=${user.forgetToken}</span>
                    </p>
                </div>
            </div>`,
            })
        } catch (exception) {
            throw exception
        }
    }
    async sendPasswordResetSuccessMail(user) {
        try {
            return await this.emailSend({
                to: user.email,
                subject: "Password Reset Successfully",
                message: `<div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 8px; overflow: hidden;">
                <!-- Header with Gradient Background -->
                <div style="background: linear-gradient(135deg, #4CAF50, #2E7D32); padding: 30px 20px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Password Successfully Updated!</h1>
                </div>
                
                <!-- Main Content -->
                <div style="padding: 30px 20px;">
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Hello ${user.name},</p>
                    <p style="font-size: 16px; color: #333; line-height: 1.6;">Your password has been successfully reset. You can now log in securely with your new credentials.</p>
                    
                    <!-- Login Button - FIXED: Correct login URL -->
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${AppConfig.feUrl}/login" style="background: linear-gradient(to right, #4CAF50, #2E7D32); color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: 600; display: inline-block; font-size: 16px; letter-spacing: 0.5px; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);">
                            Log In Now
                        </a>
                    </div>
                </div>
            </div>`
            })
        } catch (exception) {
            throw exception
        }
    }
}

const authMail = new AuthMail()
module.exports = authMail