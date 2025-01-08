const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const { ObjectId } = require("mongodb");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//몽고디비 연결 함수
const mongodbConnection = require("./configs/mongodb-connection");


const postService = require("./services/post-service");

app.engine("handlebars", handlebars.create({
    helpers: require("./configs/handlebars-helper"),
}).engine,); // 템플릿 엔진으로 핸들바 등록
app.set("view engine", "handlebars"); //웹페이지 로드 시 사용할 템플릿 엔진 설정
app.set("views", __dirname+ "/views"); //뷰 디렉터리를 views로 설정

//라우터 설정
app.get("/", async (req, res)=> {
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search || "";
    try{
        const [posts, paginator] = await postService.list(collection, page, search);

        res.render("home", { title: "테스트 게시판" , search, paginator, posts});
    }catch(err){
        console.error(err);
    }

});

app.get("/write", (req, res)=>{
    res.render("write", { title: "테스트 게시판", mode: "create"});
})

app.get("/modify/:id", async (req, res) =>{
    const post = await postService.getPostById(collection, req.params.id);
    console.log(post);
    res.render("write", {title: "테스트 게시판", mode: "modify", post})
})

app.post("/modify/", async (req, res)=> {
    const {id, title, writer, password, content} = req.body;

    const post = {
        title,
        writer,
        password,
        content,
        createdDt: new Date().toISOString(),
    };

    const result = postService.updatePost(collection, id, post);
    res.redirect(`/detail/${id}`);
})

app.post("/write", async (req, res) => {
    const post = req.body;

    const result = await postService.writePost(collection, post);
    console.log(result);
    
    res.redirect(`/detail/${result.insertedId}`)
})


app.get("/detail/:id", async (req, res) => {
    const result = await postService.getDetailPost(collection, req.params.id);
    console.log(result.value);
    res.render("detail", {
        title: "테스트 게시판",
        post: result.value,
    })
})

app.post("/check-password", async (req, res) =>{
    const {id, password} = req.body;

    const post = await postService.getPostByIdAndPassword(collection, {id, password});

    if(!post){
        return res.status(404).json({isExist: false});
    }else{
        return res.json({isExist: true});
    }
})

app.delete("/delete", async (req, res)=> {
    const { id, password } = req.body;
    try{
        const result = await collection.deleteOne({_id: ObjectId(id), password: password });
        if(result.deletedCount != 1){
            console.log("삭제 실패")
            return res.json({isSuccess: false});
        }
        return res.json({isSuccess: true});
    }catch(err){
        console.error(err);
        return res.json({isSuccess: false});
    }
})

app.post("/write-comment", async (req, res) => {
    const { id, name, password, comment } = req.body;
    const post = await postService.getPostById(collection, id);

    if(post.comments){
        post.comments.push({
            idx: post.comments.length + 1,
            name,
            password,
            comment,
            createdDt: new Date().toISOString(),
        });
    } else {
        post.comments = [
            {
                idx: 1,
                name,
                password,
                comment,
                createdDt: new Date().toISOString(),
            },
        ]
    }
    postService.updatePost(collection, id, post);
    return res.redirect(`/detail/${id}`);
})


app.delete("/delete-comment", async (req, res) => {
    const { id, idx, password } = req.body;

    const post = await collection.findOne({
        _id: ObjectId(id),
        comments: { $eleMatch: { idx: parseInt(idx), password }}
    });

    if(!post){
        return res.json({isSuccess: false});
    }

    posts.comments = post.comments.filter((comment) => comment.idx != idx);
    postService.updatePost(collection, id, post);
    return res.json({isSuccess: true});
})

let collection;
app.listen(3000, async () =>{
    console.log("Sever started");
    const MongoClient = await mongodbConnection();

    collection = MongoClient.db().collection("post");
    console.log("Mongodb CONNECTED");
})
