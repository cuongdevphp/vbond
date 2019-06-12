var express = require('express');
var jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_PREFIX]';

router.post('/', async (req, res) => {
    try {
        // const KYTU_PREFIX = req.body.KYTU_PREFIX;
        // const GHICHU = req.body.GHICHU;
        // const pool = await poolPromise;
        // const sql = `INSERT INTO ${tbl}
        //             (KYTU_PREFIX, GHICHU, NGAYTAO, FLAG) VALUES 
        //             (N'${KYTU_PREFIX}', N'${GHICHU}', '${new Date(Date.now()).toISOString()}', ${1})`;
        try {
            const user = {
                id: 1, 
                username: 'brad',
                email: 'brad@gmail.com'
            }
            
            jwt.sign({user}, 'secretkey', { expiresIn: '20s' }, (err, token) => {
                res.json({
                    token
                });
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});
  
module.exports = router;