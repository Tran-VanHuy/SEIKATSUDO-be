import bcrypt from 'bcrypt';

export const bcryptHash = async (text: string, salt: string | number = 10) => {
  return await bcrypt.hash(text, salt);
};
