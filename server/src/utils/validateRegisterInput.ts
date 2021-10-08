import { RegisterInput } from "../types/user/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
  const { email, password, username } = registerInput;

  if (!email.includes("@gmail")) {
    return {
      message: "Invalid email",
      errors: [
        {
          field: "email",
          message: "not include @gmail",
        },
      ],
    };
  }

  if (username.length <= 2) {
    return {
      message: "Invalid username",
      errors: [
        {
          field: "username",
          message: "Length must be greater than 2",
        },
      ],
    };
  }

  if (password.length < 6) {
    return {
      message: "Invalid password",
      errors: [
        {
          field: "password",
          message: "Length must be greater than 6",
        },
      ],
    };
  }

  return null;
};
