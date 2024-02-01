const express = require('express')
const zod = require('zod')
const router = express.Router()
const { User, Accounts} = require('../db')
const {JWT_SECRET} = require('../config')
const {authMiddleware} = require('../middleware')
const jwt = require("jsonwebtoken")

// signup
const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})

router.post('/signup',async(req,res)=>{
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success) {
        return res.json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username:body.username
    })

    if(user){
         return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);
    const userId = dbUser._id
    await Accounts.create({
        userId,
        balance: 1 + Math.random()*10000
    })
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
	token: token
    })
})

// sign in
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

router.post('/signin',async(req,res)=>{
    const body = req.body;
    const {success} = signinSchema.safeParse(body);
    if(!success){
        res.json(
            {
	message: "Incorrect inputs"
}
        )
    }

    const user = await User.findOne(body);

    if(user){
        const token = jwt.sign({userId: user._id}, JWT_SECRET)
        res.json({
            token: token
        })
        return
    }

    res.json({
        message: "error while logging in"
    })
})

// update
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put('/', authMiddleware, async (req, res) => {
    const { data, error } = updateBody.safeParse(req.body);
    
    if (error) {
        return res.status(400).json({
            message: "Error while updating information",
            error: error.errors
        });
    }

    try {
        await User.updateOne({ _id: req.userId }, { $set: data });
        res.json({
            message: "Update successful"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});


// finding 
router.get('/bulk', async(req,res)=>{
    const filter = req.query.filter || ""
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })  //MongoDB's $regex operator allows you to perform pattern matching on string fields. option ' i ' is because it make case insenstive
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user.id
        }))
    })
})
module.exports = router;