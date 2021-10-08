"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const argon2_1 = __importDefault(require("argon2"));
const RegisterInput_1 = require("../types/user/RegisterInput");
const type_graphql_1 = require("type-graphql");
const User_1 = require("../entities/User");
const UserMutationResponse_1 = require("../types/user/UserMutationResponse");
const validateRegisterInput_1 = require("../utils/validateRegisterInput");
const LoginInput_1 = require("../types/user/LoginInput");
const constants_1 = require("../utils/constants");
let UserResolver = class UserResolver {
    async register(registerInput, { req }) {
        const validateInputError = (0, validateRegisterInput_1.validateRegisterInput)(registerInput);
        if (validateInputError !== null) {
            return Object.assign({ code: 400, success: false }, validateInputError);
        }
        try {
            const { email, password, username } = registerInput;
            const existedUsername = await User_1.User.findOne({
                where: [{ username }, { email }],
            });
            if (existedUsername) {
                return {
                    code: 400,
                    success: false,
                    message: "Existed username or email",
                    errors: [
                        {
                            field: existedUsername.username === username ? "username" : "email",
                            message: `${existedUsername.username === username ? "username" : "email"} already taken`,
                        },
                    ],
                };
            }
            const hashedPassword = await argon2_1.default.hash(password);
            const newUser = User_1.User.create({
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
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            };
        }
    }
    async login({ usernameOrEmail, password }, { req }) {
        try {
            const existingUser = await User_1.User.findOne(usernameOrEmail.includes("@")
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail });
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
            const passwordValid = await argon2_1.default.verify(existingUser.password, password);
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
            req.session.userId = existingUser.id;
            return {
                code: 200,
                success: true,
                message: "Login successfully",
                user: existingUser,
            };
        }
        catch (error) {
            return {
                code: 500,
                success: false,
                message: `Internal server error ${error.message}`,
            };
        }
    }
    logout({ req, res }) {
        return new Promise((resolve, _reject) => {
            res.clearCookie(constants_1.COOKIE_NAME);
            req.session.destroy((error) => {
                if (error) {
                    console.log("SESSION_ERROR", error);
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)((_return) => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("registerInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterInput_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => UserMutationResponse_1.UserMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("loginInput")),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginInput_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=users.js.map