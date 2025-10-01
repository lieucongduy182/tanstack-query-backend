import { PartialType, ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CreatePostDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({ example: 42, required: false })
  @IsNumber()
  @IsOptional()
  likes?: number;
}
