import CustomError from '../../../utils/Error';
import { getUserByEmail,getUserById } from '../User/repository';
import { Auth, RefreshTokenPayloadType } from '../../../types/auth';
import { messages } from '../../../utils/Messages';
import { generateToken, signJwt, verifyJwt, verifyToken } from '../../../utils/Jwt';
import { omit } from '../../../utils';
import { UserModel, userPrivateFields } from '../../../models/user';
import { sendEmailWithHTML } from '../../../utils/otp';
// import bcrypt from 'bcryptjs'

const AuthService = {
  async login(data: Auth) {
    const user = await getUserByEmail(data.email);
    if (!user) throw new CustomError(messages.auth.invalid_account, 401);
    if(!user._id) throw new CustomError(messages.auth.userId_not_found,401);
    const isValid = await user.comparePassword(data.password);
    if (!isValid) throw new CustomError(messages.auth.invalid_account, 401);

    const accessToken = signJwt(omit(user.toJSON(), userPrivateFields), 'accessToken', { expiresIn: '7d' });
    
    const refreshToken = signJwt({ userId: user._id.toString() }, 'refreshToken', { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
  },

  async verifyToken(token: string, type: 'accessToken' | 'refreshToken') {
    const user = verifyJwt(token, type);
    console.log(user);
    return user;
    
  },

  async generateNewToken(token:string){
   const payload:RefreshTokenPayloadType|any =await this.verifyToken(token,'refreshToken');
   if(!payload) throw new CustomError(messages.auth.auth_token_expired,401);
    const user = await getUserById(payload.userId)
    if (!user) throw new CustomError(messages.auth.invalid_user_id, 401);
    if(!user._id) throw new CustomError(messages.auth.userId_not_found,401);
    const accessToken = signJwt(omit(user.toJSON(), userPrivateFields), 'accessToken', { expiresIn: '7d' });
    const refreshToken = signJwt({ userId: user._id.toString() }, 'refreshToken', { expiresIn: '30d' });

    return {
      accessToken,
      refreshToken,
    };
   
   
  },

  async generatePasswordResetLink(email: string) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error('User not found.');
    }

    const token = generateToken({ userId: user._id }, '1h'); // Generate token valid for 1 hour
    const resetLink = `${process.env.FRONTEND_URL}/login/reset-password?token=${token}`;

    // Send email with reset link
    // await MailService.sendMail({
    //   to: email,
    //   subject: 'Password Reset Request',
    //   text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    // });
    await sendEmailWithHTML(`You requested a password reset. Click the link to reset your password: ${resetLink}`,user.email,"Password Reset Request");

    return { message: 'Password reset link sent successfully.' };
  }
  ,

 async resetPassword(token: string, newPassword: string) {
    const payload = verifyToken(token);
    if (!payload || typeof payload === 'string' || !payload.userId) {
      throw new Error('Invalid or expired token.');
    }

    const user = await UserModel.findById(payload.userId);
    if (!user) {
      throw new Error('User not found.');
    }

    //const salt = await bcrypt.genSalt(10);
    user.password = newPassword
    await user.save();

    return { message: 'Password reset successfully.' };
  }

};

export default AuthService;
