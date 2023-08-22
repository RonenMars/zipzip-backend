import * as bcrypt from 'bcrypt';

export const hashPassword = async (
  password: string | undefined,
): Promise<string> => {
  if (password) {
    return await bcrypt.hash(password, 10);
  } else return '';
};

export const verifyPassword = async ({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
