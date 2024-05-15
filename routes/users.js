const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, validationResult } = require('express-validator');

// jwt모듈
const jwt = require('jsonwebtoken');
// dotenv 모듈
const dotenv = require('dotenv');
dotenv.config();

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (err.isEmpty()) {
        return next(); // 다음 할 일 (미들웨어, 함수)
    } else {
        return res.status(400).json(err.array());
    }
}

router.use(express.json());

router.post(
    '/login',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ],
    (req, res) => {
        const { email, password } = req.body;

        let sql = 'select * from users where email = ?';
        conn.query(
            sql, email, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).end();
                }

                var loginUser = results[0];

                if (loginUser && loginUser.password == password) {
                    const token = jwt.sign({
                        email : loginUser.email,
                        name : loginUser.name
                    }, process.env.PRIVATE_KEY);

                    res.cookie("token", token);

                    res.status(200).json({
                        message: `${loginUser.name}님 로그인 되었습니다.`
                    });
                } else {
                    res.status(403).json({
                        message: '이메일 또는 비밀번호가 틀렸습니다.'
                    });
                }
            }
        );
    });

router.post(
    '/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('name').notEmpty().isString().withMessage('이름 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('conatact').notEmpty().isString().withMessage('연락처 확인 필요'),
        validate
    ],
    (req, res) => {
        const { email, name, password, contact } = req.body;

        let sql = 'insert into users (email, name, password, contact) values (?, ?, ?, ?)';
        let values = [email, name, password, contact];
        conn.query(
            sql, values, (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(400).end();
                }

                res.status(200).json(results);
            }
        );
    })

router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ]
        , (req, res) => {
            let { email } = req.body;

            let sql = `select * from users where email = ?`;
            conn.query(
                sql, email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }
                    res.status(200).json(results);
                });
        })
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ]
        , (req, res) => {
            let { email } = req.body;

            let sql = 'delete from users where email = ?';
            conn.query(
                sql, email, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end();
                    } else {
                        res.status(200).json(results);
                    }
                });
        });

module.exports = router;