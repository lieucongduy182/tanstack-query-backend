import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    if (page !== undefined && limit !== undefined) {
      return this.postService.findPaginated(page, limit);
    }

    return this.postService.findAll();
  }

  @Get('infinite')
  @ApiOperation({ summary: 'Get posts for infinite scrolling' })
  @ApiQuery({ name: 'pageParam', required: false, type: Number })
  findInfinite(@Query('pageParam') pageParam: number = 0) {
    return this.postService.findInfinite(pageParam);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'Post retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a post by ID' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Like a post by ID' })
  like(@Param('id') id: string) {
    return this.postService.like(+id);
  }

  @Post(':id/unlike')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike a post by ID' })
  unlike(@Param('id') id: string) {
    return this.postService.unlike(+id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  delete(@Param('id') id: string) {
    return this.postService.delete(+id);
  }
}
