var express = require('express');
var jwt = require('jsonwebtoken');
const { poolPromise } = require('../db');
var router = express.Router();
const tbl = '[dbo].[TB_USER]';

router.post('/', async (req, res) => {
    try {
        const USERNAME = req.body.USERNAME;
        const PASSWORD = req.body.PASSWORD;

        const pool = await poolPromise;
        const sql = `SELECT USERNAME, FullName, Email, FLAG 
                        FROM ${tbl} 
                        WHERE PASSWORD = '${PASSWORD}' AND 
                            (USERNAME = '${USERNAME}' OR Email = '${USERNAME}')`;
        const result = await pool.request().query(sql);
        if(result.recordset.length === 0) {
            res.status(404).json({ error: 'Username or password is wrong' });
        } else {
            try {
                const user = result.recordset;
                jwt.sign({ user }, 'secretkey', { expiresIn: '3600s' }, (err, token) => {
                    res.json({
                        token,
                        user
                    });
                });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  
module.exports = router;