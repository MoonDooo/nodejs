const paginator = require("../utils/paginator")
const { ObjectId } = require("mongodb");

async function writePost(collection, post){
    post.hits = 0;
    post.createdDt = new Date().toISOString();
    console.log(post);
    return await collection.insertOne(post);
}

async function list(collection, page, search){
    const perPage = 10;

    const query = {title : new RegExp(search, "i")};
    //title이 search와 부분일치하는지 확인 ( 정규식, "i" 는 정규식 플래그로 대소문자 구분하지 않음 )

    const cursor = collection.find(query, {limit : perPage, skip: (page-1) * perPage })
        .sort({
            createdDt: -1,
        })
    const totalCount = await collection.count(query);
    const posts = await cursor.toArray();
    //페이지네이터 생성
    const paginatorObj = paginator({totalCount, page, perPage: perPage});
    return [posts, paginatorObj];
}

// sql문의 그 프로젝션과 유사
const projectionOption = {
    projection: {
        password: 0,
        "comments.password": 0,
    }
}

async function getPostByIdAndPassword(collection, {id, password}){
    return await collection.findOne({_id: ObjectId(id), password: password, projectionOption})
}

async function getPostById(collection, id){
    return await collection.findOne({_id: ObjectId(id)}, projectionOption);
}

async function updatePost(collection, id, post) {
    const toUpdatePost = {
        $set: {
            ...post,
        },
    }
    return await collection.updateOne({_id: ObjectId(id)}, toUpdatePost);
}


async function getDetailPost(collection, id){
    return await collection.findOneAndUpdate({_id: ObjectId(id)}, { $inc: {hits: 1 } }, projectionOption);
}

//require()로 파일을 임포트 시 외부로 노출하는 객체
module.exports = {
    list,
    writePost,
    getDetailPost,
    getPostById,
    getPostByIdAndPassword,
    updatePost,
};