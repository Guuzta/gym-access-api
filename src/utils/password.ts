import bcrypt from "bcrypt";

async function hash(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

async function compare(
  password: string,
  userPassword: string,
): Promise<boolean> {
  const isPasswordValid = await bcrypt.compare(password, userPassword);

  return isPasswordValid;
}

export { hash, compare };
