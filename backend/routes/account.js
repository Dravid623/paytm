const express = require('express')
const { User, Accounts } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();
const mongoose = require('mongoose')

router.get('/balance', authMiddleware, async(req,res)=>{
    const accountInformation = await Accounts.findOne({
        userId: req.userId
    })
    res.json({
        balance: accountInformation.balance
    })
})


router.post('/transfer', authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();   
    const {to, amount} = req.body;
    const account = await Accounts.findOne({userId: req.userId}).session(session)
    if(!account || account.balance < amount){
        await session.abortTransaction()
        return res.status(400).json({
            message: "insufficient balance"
        });
    }
    const toAccount = await Accounts.findOne({userId: to}).session(session);
    if(!toAccount){
        await session.abortTransaction()
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    try {
        await Accounts.updateOne({userId: req.userId}, {$inc: { balance: -amount}}).session(session)
        await Accounts.updateOne({userId: to}, {$inc: {balance: amount}}).session(session)
        await session.commitTransaction()
        res.json({
            message: "Transfer successful"
        })
    } catch (error) {
        await session.abortTransaction();
        console.error(error)
    } finally {
        await session.endSession();
    }
})

module.exports = router;