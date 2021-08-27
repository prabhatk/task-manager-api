const sharp = require('sharp')
const User = require('../models/user')
const express = require('express')
const { update } = require('../models/task')
const auth = require('../middleware/auth')
const { response } = require('express')
const router = new express.Router()
const multer = require('multer')


router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch (e) {
        res.status(400).send(e)
    }
    //old way to achieve the same as above
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// router.get('/users', auth ,async (req, res) => {
//     try {
//         const users = await User.find({})
//         res.send(users)
//     } catch (e) {
//         res.status(500).send(e)
//     }
// })
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentails(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        // res.send({user : user.getPublicProfile(), token})
        res.send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    
    if (!isValidOperation) {
        return res.status(400).send({error : 'Invalid Updates!'})
    }

    // const _id = req.user._id//req.params.id
    try {
        // const user = //await User.findById(_id)
        updates.forEach((update) => req.user[update] = req.body[update])
        // const user = await User.findByIdAndUpdate(_id, req.body, { new : true, runValidators : true})
        // above method by passes mangoose to use with Schema
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    // const _id = req.params.id
    try {
        // const user = await User.findByIdAndDelete(_id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove() // this line came in to picture because of auth param 
        res.send(user)
    }catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb( new Error('Please upload jpg/ jpeg/ png files only'))
        }
        cb(undefined,true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 200, height: 200}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (e){
        console.log(e)
        res.status(400).send()
    }
})

module.exports = router