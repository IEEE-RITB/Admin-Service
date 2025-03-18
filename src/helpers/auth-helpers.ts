import bcrypt from 'bcryptjs';
import { configs } from '@/configs';

export async function saltAndHashPassword(password:string) {
    const salt = await bcrypt.genSalt(configs.authConfig.salt_rounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}
