const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

app.engine("handlebars", handlebars.engine()); // 템플릿 엔진으로 핸들바 등록
app.set("view engine", "handlebars"); //웹페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname+ "/views"); //뷰 디렉터리를 views로 설정

//라우터 설정
app.get("/", (req, res)=> {
    res.render("home", { title: "안녕하세요", message: "만나서 반갑습니다! "});
});

app.listen(3000);