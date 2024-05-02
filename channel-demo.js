// express 모듈 세팅
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json()) // http 외 모듈 'json'

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함


app
    .route('/channels')
    .get((req, res)=>{

    }) // 채널 전체 조회
    .post((req, res)=>{

    }) // 채널 개별 생성

app
    .route('channels/:id')
    .get((req, res)=>{

    }) // 채널 개별 조회
    .put((req, res)=>{
        
    }) // 채널 개별 수정
    .delete((req, res)=>{
        
    }) // 채널 개별 삭제
