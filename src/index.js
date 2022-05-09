// General imports
import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import cors from 'cors'


// Route imports
import authRouter from './routers/auth.router'
import assetRouter from './routers/asset.router'
import transactionRouter from './routers/transaction.router'
import userRouter from './routers/user.router'
import superadminRouter from './routers/superadmin.router'


// Initializations
const dapp = express()
const port = process.env.PORT || 5001


// Middewares
dapp.use(express.json())
dapp.use(express.urlencoded({ extended: true }))
dapp.use(cors({ credentials: true, origin: ['http://localhost:8080'] }))


// Routes
dapp.use('/api/auth', authRouter)
dapp.use('/api/assets', assetRouter)
dapp.use('/api/transactions', transactionRouter)
dapp.use('/api/user', userRouter)
dapp.use('/api/superadmin', superadminRouter)
dapp.use('/api/src/uploads', express.static(path.resolve(__dirname, 'uploads')))


// Server and database are listening
mongoose.connect('mongodb://localhost/tfg-dapp-database')
    .then(db => console.log('DB is connected'))
    .catch(err => console.log(err))
dapp.listen(port, () => {console.log(`Api rest server on port ${port}`)})