import { Controller, Get } from "@nestjs/common";

@Controller()
export class HelloController{ // 외부에서 사용하므로 export 필요
    @Get()
    hello() {
        return "안녕하세요! NestJS로 만든 첫 애플리케이션입니다.";
    }
}