// express 모듈 세팅
const express = require('express');
const app = express();

app.listen(7777);

// 로그인
app.post('/login', (req, res)=>{

})

// 회원가입
app.post('/join', (req, res)=>{
    
})

// 회원 개별 조회
app.get('/users/:id', (req, res)=>{
    
})

// 회원 개별 탈퇴
app.delete('/users/:id', (req, res)=>{
    
})