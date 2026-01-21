const isValidPassword = async (password: string, hashedPassword: string) => {
  return (await hashPassword(password)) === hashedPassword;
};

const hashPassword = async (password: string) => {
  //encrypt password
  const arrayBuffer = await crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(password)
  );

  //   convert into base64
  return Buffer.from(arrayBuffer).toString("base64");
};


export {
    isValidPassword, hashPassword
}