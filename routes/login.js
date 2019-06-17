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
        //console.log(result, "result");
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

router.post('/loginCore', async (req, res) => {
    try {
        const USERNAME = req.body.USERNAME;
        const PASSWORD = req.body.PASSWORD;
        const FullName = req.body.FullName;
        const Email = req.body.Email;

        const pool = await poolPromise;
        const sql = `SELECT USERNAME 
                        FROM ${tbl} 
                        WHERE USERNAME = '${USERNAME}'`;
        const result = await pool.request().query(sql);
        if(result.recordset.length === 0) {
            const sql = `INSERT INTO ${tbl}
                (USERNAME, PASSWORD, FullName, Email, CreateDate, FLAG) VALUES 
                (N'${USERNAME}', N'${PASSWORD}', N'${FullName}', N'${Email}', '${new Date(Date.now()).toISOString()}', ${1});`
            try {
                await pool.request().query(sql);
                createToken(result);
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        } else {
            createToken(result);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function createToken (data) {
    try {
        const user = data.recordset;
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
module.exports = router;