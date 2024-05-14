const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json(err.array());
    } else {
        return next(); // 다음 할 일 (미들웨어, 함수)
    }
}

router
    .route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
            validate
        ]
        , (req, res, next) => {
            var { userId } = req.body;

            let sql = 'select * from channels where user_id = ?';
            if (userId) {
                conn.query(
                    sql, userId, (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(400).end();
                        }
                        if (results.length)
                            res.status(200).json(results);
                        else
                            notFoundChannel(res);
                    }
                );
            } else {
                res.status(400).end();
            }
        }) // 채널 전체 조회
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
            body('name').notEmpty().isString().withMessage('문자 입력 필요'),
            validate
        ]
        , (req, res) => {
            const { name, userId } = req.body;
            let sql = 'insert into channels (name, user_id) values (?, ?)';
            let values = [name, userId];
            conn.query(
                sql, values, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }
                    res.status(200).json(results);
                });


        }) // 채널 개별 생성

router
    .route('/:id')
    .get(
        [
            param('id').notEmpty().withMessage('채널id 필요'),
            validate
        ]
        , (req, res) => {
            let { id } = req.params;
            id = parseInt(id);

            let sql = 'select * from channels where id = ?';
            conn.query(
                sql, id, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }

                    if (results.length)
                        res.status(200).json(results);
                    else
                        notFoundChannel(res);
                }
            );
        }) // 채널 개별 조회
    .put(
        [
            param('id').notEmpty().withMessage('채널id 필요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ]
        , (req, res) => {
            let { id } = req.params;
            id = parseInt(id);
            let { name } = req.body;

            let sql = 'update channels set name = ? where id = ?';
            let values = [name, id]
            conn.query(
                sql, values, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }

                    if (results.affectedRows == 0) {
                        return res.status(400).end();
                    } else {
                        res.status(200).json(results);
                    }
                }
            );
        }) // 채널 개별 수정
    .delete(
        [
            param('id').notEmpty().withMessage('채널id 필요'),
            validate
        ]
        , (req, res) => {
            let { id } = req.params;
            id = parseInt(id);

            let sql = 'delete from channels where id = ?';
            conn.query(
                sql, id, (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(400).end();
                    }

                    res.status(200).json(results);
                }
            );
        }) // 채널 개별 삭제

module.exports = router;