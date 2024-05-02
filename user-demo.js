// express 모듈 세팅
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json()) // http 외 모듈 'json'

let db = new Map();
var id = 1; // 하나의 객체를 유니크하게 구별하기 위함
db.set(id++, { "userId": "testId1", "password": 1234, "name": "tester1" });
db.set(id++, { "userId": "testId2", "password": 1234, "name": "tester2" });
db.set(id++, { "userId": "testId3", "password": 1234, "name": "tester3" });
// 로그인
app.post('/login', (req, res) => {
    console.log(req.body); // userId, pwd

    // userId가 db에 저장된 회원인지 확인
    const { userId, password } = req.body;
    var loginUser = {};

    db.forEach((user, id) => {
        if (user.userId === userId) {
            loginUser = user;
        }
    });

    if (isExist(loginUser)) {
        console.log('입력하신 아이디는 없는 아이디 입니다.');
    } else {
        console.log('아이디 일치');
        // pwd도 맞는지 비교
        if (loginUser.password === password) {
            console.log('패스워드 일치');
        } else {
            console.log('패스워드 불일치');
        }
    }
})

function isExist(obj){
    if(Object.keys(obj).length){
        return true;
    }else{
        return false;
    }
}

// 회원가입
app.post('/join', (req, res) => {
    console.log(req.body);

    if (req.body.userId && req.body.password && req.body.name) {
        db.set(id++, req.body);
        res.status(201).json({
            message: `${db.get(id - 1).name}님 환영합니다.`
        });
    } else {
        res.status(400).json({
            message: `입력 값을 다시 확인해주세요.`
        });
    }
})

app
    .route('/users/:id')
    .get((req, res) => {
        let { id } = req.params;
        id = parseInt(id);

        const user = db.get(id);
        if (user == undefined) {
            res.status(404).json({
                message: '회원 정보가 없습니다.'
            });
        } else {
            res.status(200).json({
                userId: user.userId,
                name: user.name
            });
        }
    })
    .delete((req, res) => {
        let { id } = req.params;
        id = parseInt(id);

        const user = db.get(id);
        if (user == undefined) {
            res.status(404).json({
                message: '회원 정보가 없습니다.'
            });
        } else {
            db.delete(id);

            res.status(200).json({
                message: `${user.name}님 다음에 또 뵙겠습니다.`
            });
        }
    })

// // 회원 개별 조회
// app.get('/users/:id', (req, res) => {
//     let { id } = req.params;
//     id = parseInt(id);

//     const user = db.get(id);
//     if (user == undefined) {
//         res.status(404).json({
//             message : '회원 정보가 없습니다.'
//         });
//     } else {
//         res.status(200).json({
//             userId : user.userId,
//             name : user.name
//         });
//     }
// })

// // 회원 개별 탈퇴
// app.delete('/users/:id', (req, res) => {
//     let { id } = req.params;
//     id = parseInt(id);

//     const user = db.get(id);
//     if (user == undefined) {
//         res.status(404).json({
//             message : '회원 정보가 없습니다.'
//         });
//     } else {
//         db.delete(id);

//         res.status(200).json({
//             message : `${user.name}님 다음에 또 뵙겠습니다.`
//         });
//     }
// })