import generateUniqueAccessCode from "../../src/utils/generateUniqueAccessCode";

async function makeClient(
  firstName: string,
  lastName: string,
  cpf: string,
  isActive: boolean,
) {
  const accessCode = await generateUniqueAccessCode();

  return {
    firstName,
    lastName,
    cpf,
    accessCode,
    isActive,
  };
}

export default makeClient;
