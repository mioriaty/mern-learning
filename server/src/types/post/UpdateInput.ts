import { Field, ID, InputType } from "type-graphql";

@InputType()
export class UpdatePostInput {
  @Field(() => ID)
  id: number;
  
  @Field()
  text: string;
  
  @Field()
  title: string;
}