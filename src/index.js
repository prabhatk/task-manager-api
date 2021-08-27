const { response } = require('express')
const express = require('express')
require('./db/mongoose')
// const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
// const User = require('./models/user')

const app = express()
const port = process.env.PORT // already getting from dev.env

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send(' GET requests are disabled')
//     } else {
//         next()
//     }
// })

// middle ware now shitfted to middleware/auth.js
// app.use((req, res, next) => {
//     res.status(503).send('Applicaion is in mantinance mode')
// })
app.use(express.json()) // this setting will parse the incoming json
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up on port¸ ' + port)
})

// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     const token = jwt.sign({_id: 'abc123'},process.env.JWT_SECRET, {expiresIn : '7 days'})
//     console.log(token)
//     const payload = jwt.verify(token, process.env.JWT_SECRET)
//     console.log(payload)
// }
// myFunction()

// const bcrypt = require('bcryptjs')
// const myFunction = async () => {
//     const password = 'prabhat'
//     const hashedPassword = await bcrypt.hash(password, 8)
    
//     console.log(password)
//     console.log(hashedPassword)

//     const isMatch = await bcrypt.compare('prabhat', hashedPassword)
//     console.log(isMatch)
// }
// myFunction()

// const pet = {
//     name : 'Hal'
// }
// pet.toJSON = function () {
//     console.log(this)
//     return this
// }
// console.log(JSON.stringify(pet))

// on call of JSON.stringify there is toJSON() function response

// const Task = require('./models/task')
// const User = require('./models/user')
// const main = async () => {
// // const task = await Task.findById('612389612db1110ba4e31266')
// // await task.populate('owner').execPopulate()
// // console.log(task)
// const user  = await User.findById('612388478b05cf0ae29ddd40')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)
// }

// main()

// const multer = require('multer')
// const upload = multer({
//     dest : 'images'
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// })