// General imports
import User from '../models/User'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'


// Local libs
import { generateTokenById } from '../libs/jwt'


// Sign In function (login)
export const signIn = async (req, res) =>
{
    try
    {
        const { username, password } = req.body

        const userFound = await User.findOne({ username: username })

        if (!userFound || !await bcryptjs.compare(password, userFound.password))
            return res.status(404).json({ message: 'Username or password are incorrect' })
        
        else
        {
            const token = generateTokenById(userFound._id)
            
            const data = {
                username: userFound.username,
                email: userFound.email,
                role: userFound.role,
                KYCState: userFound.KYCState
            }

            return res.status(200).json({token: token, user: data})
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}


// Sign Up function (register)
export const signUp = async (req, res) =>
{
    try
    {
        const { username, email, password, passwordConfirm, roles } = req.body

        if (await User.findOne({ username: username}))
            return res.status(409).json({ message: 'Username is already in use' })
    
        else if (await User.findOne({ email: email}))
            return res.status(409).json({ message: 'Email is already in use' })
    
        else if (password != passwordConfirm)
            return res.status(409).json({ message: 'Password does not match' })
    
        else
        {
            const newUser = await new User({
                username,
                email,
                password: await bcryptjs.hash(password, await bcryptjs.genSalt(10)),
                role: roles,
                KYCState: 0
            }).save()

            const token = generateTokenById(newUser._id)

            const data = {
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                KYCState: newUser.KYCState
            }

            return res.status(200).json({token: token, user: data})
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}


export const getUserByToken = async (req, res) =>
{
    try
    {
        const { token } = req.body

        if (token === null)
            return res.status(400).json({message: 'No token provided'})

        else
        {
            const decoded = jwt.verify(token, 'secret')
            const userInSession = await User.findOne({ _id: decoded.id })

            if (!userInSession)
                return res.status(401).json({message: 'Unauthorized: Invalid token'})
            
            else
            {
                const data = {
                    username: userInSession.username,
                    email: userInSession.email,
                    role: userInSession.role,
                    KYCState: userInSession.KYCState
                }

                res.status(200).json({user: data})
            }
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}