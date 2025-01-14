import {PostDto} from './blog.model'
import { BlogFileRepository, BlogRepository } from './blog.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BlogService{
    constructor( private blogRepository: BlogFileRepository ){}

    async getAllPosts(){
        return await this.blogRepository.getAllPost();
    }

    createPost(postDto: PostDto){
        this.blogRepository.createPost(postDto);
    }

    async getPost(id){
        return await this.blogRepository.getPost(id);
    }

    delete(id){
        this.blogRepository.deletePost(id);
    }

    updatePost(id, postDto: PostDto){
        this.blogRepository.updatePost(id, postDto);
    }
}