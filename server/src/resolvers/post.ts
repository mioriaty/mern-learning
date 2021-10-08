import { PostMutationResponse } from "../types/post/PostMutationResponse";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { CreatePostInput } from "../types/post/CreateInput";
import { Post } from "../entities/Post";
import { UpdatePostInput } from "../types/post/UpdateInput";

@Resolver()
export class PostResolver {
  @Mutation(() => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") createPostInput: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const { text, title } = createPostInput;
      const newPost = Post.create({ title, text });
      const result = await newPost.save();

      return {
        code: 200,
        success: true,
        post: result,
        message: "Created post successfully",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Query(() => [Post], { nullable: true })
  async readPosts(): Promise<Post[] | undefined> {
    try {
      const posts = await Post.find();
      return posts;
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  @Query(() => Post)
  async readSinglePost(
    @Arg("id", () => ID) id: number
  ): Promise<Post | undefined> {
    try {
      const post = await Post.findOne(id);
      return post;
    } catch (error) {
      return undefined;
    }
  }

  @Mutation(() => PostMutationResponse)
  async updatePost(
    @Arg("updateInput") updateInput: UpdatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const { id, text, title } = updateInput;
      const existingPost = await Post.findOne(id);
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
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }

  @Mutation(() => PostMutationResponse)
  async deletePost(
    @Arg("id", () => ID) id: number
  ): Promise<PostMutationResponse> {
    try {
      const post = await Post.findOne(id);
      if (!post) {
        return {
          code: 400,
          success: false,
          message: "Post not found",
        };
      }

      await Post.delete({ id });

      return {
        code: 200,
        success: true,
        message: "Delete post successfully",
      };
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server error ${error.message}`,
      };
    }
  }
}
