const express = require('express');
const common = require('./common');
const { poolPromise } = require('./db');
const router = express.Router();
const tbl_investors = '[dbo].[TB_NHADAUTU]';

module.exports = {
    verifyToken: (req, res, next) => {
        // FORMAT OF TOKEN
        // Authorization: Bearer <access_token>
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            next();
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    },
    verifyTokenUser: async (req, res, next) => {
        // FORMAT OF TOKEN
        // Authorization: Bearer <access_token>
        // Get auth header value
        const bearerHeader = req.headers['authorization'];
        // Check if bearer is undefined
        if(typeof bearerHeader !== 'undefined') {
            // Split at the space
            const bearer = bearerHeader.split(' ');
            // Get token from array
            const bearerToken = bearer[1];
            // Set the token
            req.token = bearerToken;
            // Next middleware
            const lastToken = await common.lastToken(bearerToken);
            const pool = await poolPromise;
            const result = await pool.request().query(`
                SELECT MSNDT FROM ${tbl_investors} WHERE TOKEN LIKE '${lastToken}'
            `);
            if(result.recordset.length === 0) {
                res.sendStatus(403);
            } else {
                req.MSNDT = result.recordset[0].MSNDT;
                next();
            }
        } else {
            // Forbidden
            res.sendStatus(403);
        }
    }
};