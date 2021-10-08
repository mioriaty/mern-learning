import argon2 from "argon2";
import { RegisterInput } from "../types/user/RegisterInput";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { User } from "../entities/User";
import { UserMutationResponse } from "../types/user/UserMutationResponse";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/user/LoginInput";
import { Context } from "../types/Context";
import { COOKIE_NAME } from "../utils/constants";

@Resolver()
export class UserResolver {
  // create user
  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg("registerInput") registerInput: RegisterInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    const validateInputError = validateRegisterInput(registerInput);

    if (validateInputError !== null) {
      return {
        code: 400,
        success: false,
        ...validateInputError,
      };
    }

    try {
      const { email, password, username } = registerInput;

      const existedUsername = await User.findOne({
        where: [{ username }, { email }],
      });
      if (existedUsername) {
        return {
          code: 400,
          success: false,
          message: "Existed username or email",
          errors: [
            {
              field:
                existedUsername.username === username ? "username" : "email",
              message: `${
                existedUsername.username === username ? "username" : "email"
              } already taken`,
            },
          ],
        };
      }
      const hashedPassword = await argon2.hash(password);

      const newUser = User.create({
        email,
        username,
        password: hashedPassword,
      });

      const result = await newUser.save();

      req.session.userId = result.id;
      
      return {
        code: 200,
        user: result,
        success: true,
        message: "Register successfully!",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  // login
  @Mutation(() => UserMutationResponse)
  async login(
    @Arg("loginInput") { usernameOrEmail, password }: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserMutationResponse> {
    try {
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      );

      if (!existingUser) {
        return {
          code: 400,
          success: false,
          message: "User not found",
          errors: [
            {
              field: "usernameOrEmail",
              message: "usernameOrEmail is not correct",
            },
          ],
        };
      }

      const passwordValid = await argon2.verify(
        existingUser.password,
        password
      );

      if (!passwordValid) {
        return {
          code: 400,
          success: false,
          message: "Wrong password",
          errors: [
            {
              field: "password",
              message: "Wrong password",
            },
          ],
        };
      }

      // create session and return cookie
      req.session.userId = existingUser.id;

      return {
        code: 200,
        success: true,
        message: "Login successfully",
        user: existingUser,
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    // phải return new promise mà không dùng async/await là do req.session.destroy không trả về 1 promise
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME);
      req.session.destroy((error) => {
        if (error) {
          console.log("SESSION_ERROR", error);
          resolve(false);
        }
        resolve(true);
      });
    });
  }
}
