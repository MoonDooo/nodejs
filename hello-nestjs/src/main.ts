import { NestFactory } from "@nestjs/core";
import { HelloModule } from "./hello.module";

// NestJS를 시작시키는 함수
async function bootstrap(){
    const app = await NestFactory.create(HelloModule);

    await app.listen( 3000, () => { console.log ("서버 시작!"); });
}

bootstrap();