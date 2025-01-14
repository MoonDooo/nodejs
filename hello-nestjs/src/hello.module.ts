import { Module } from "@nestjs/common";
import { BlogController } from '../../blog/src/blog.controller';
import { BlogService } from '../../blog/src/blog.service';

@Module({
    imports: [],
    controllers: [BlogController],
    providers: [BlogService],
})
export class HelloModule{}