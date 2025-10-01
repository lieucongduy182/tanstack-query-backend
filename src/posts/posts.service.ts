import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findPaginated(page: number, limit: number) {
    const [posts, total] = await this.postRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      posts,
      total,
      hasMore: page * limit < total,
    };
  }

  async findInfinite(pageParam: number) {
    const limit = 3;
    const skip = pageParam * limit;

    const [posts, total] = await this.postRepository.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    const hasMore = skip + limit < total;
    const nextCursor = hasMore ? pageParam + 1 : undefined;

    return {
      posts,
      nextCursor,
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    Object.assign(post, updatePostDto);

    return await this.postRepository.save(post);
  }

  async like(id: number) {
    const post = await this.findOne(id);
    post.likes = post.likes + 1;

    return await this.postRepository.save(post);
  }

  async unlike(id: number) {
    const post = await this.findOne(id);
    post.likes = Math.max(0, post.likes - 1);

    return await this.postRepository.save(post);
  }

  async delete(id: number) {
    const post = await this.findOne(id);

    return await this.postRepository.remove(post);
  }
}
