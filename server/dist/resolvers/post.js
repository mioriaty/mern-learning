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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResolver = void 0;
const PostMutationResponse_1 = require("../types/post/PostMutationResponse");
const type_graphql_1 = require("type-graphql");
const CreateInput_1 = require("../types/post/CreateInput");
const Post_1 = require("../entities/Post");
const UpdateInput_1 = require("../types/post/UpdateInput");
let PostResolver = class PostResolver {
    async createPost(createPostInput) {
        try {
            const { text, title } = createPostInput;
            const newPost = Post_1.Post.create({ title, text });
            const result = await newPost.save();
            return {
                code: 200,
                success: true,
                post: result,
                message: "Created post successfully",
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
    async readPosts() {
        try {
            const posts = await Post_1.Post.find();
            return posts;
        }
        catch (error) {
            console.log(error);
            return undefined;
        }
    }
    async readSinglePost(id) {
        try {
            const post = await Post_1.Post.findOne(id);
            return post;
        }
        catch (error) {
            return undefined;
        }
    }
    async updatePost(updateInput) {
        try {
            const { id, text, title } = updateInput;
            const existingPost = await Post_1.Post.findOne(id);
            if (!existingPost) {
                return {
                    code: 400,
                    success: false,
                    message: "Post not found",
                };
            }
            existingPost.title = title;
            existingPost.text = text;
            const updatedPost = await existingPost.save();
            return {
                code: 200,
                success: true,
                post: updatedPost,
                message: "Update post successfully",
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
    async deletePost(id) {
        try {
            const post = await Post_1.Post.findOne(id);
            if (!post) {
                return {
                    code: 400,
                    success: false,
                    message: "Post not found",
                };
            }
            await Post_1.Post.delete({ id });
            return {
                code: 200,
                success: true,
                message: "Delete post successfully",
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
};
__decorate([
    (0, type_graphql_1.Mutation)(() => PostMutationResponse_1.PostMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("createPostInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateInput_1.CreatePostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "createPost", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Post_1.Post], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "readPosts", null);
__decorate([
    (0, type_graphql_1.Query)(() => Post_1.Post),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "readSinglePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostMutationResponse_1.PostMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("updateInput")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UpdateInput_1.UpdatePostInput]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "updatePost", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PostMutationResponse_1.PostMutationResponse),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PostResolver.prototype, "deletePost", null);
PostResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.js.map