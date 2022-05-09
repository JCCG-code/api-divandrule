// General imports
import User from '../models/User'
import jwt from 'jsonwebtoken'


// Function superadmin check
export const isSuperAdmin = async (req, res, next) =>
{
    try
    {
        const bearerHeader = req.headers['authorization']

        if (!bearerHeader)
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
    
        else
        {
            const bearerHeaderSplit = bearerHeader.split(' ', 2)
            const token = bearerHeaderSplit[1]

            const decoded = jwt.verify(token, 'secret')

            const userInSession = await User.findOne({ _id: decoded.id })

            if (!userInSession)
                return res.status(401).json({message: 'Unauthorized: Invalid token'})
            
            else
            {
                if (userInSession.role.some(role => role === 'superadmin'))
                    next()

                else
                    return res.status(401).json({message: 'Unauthorized: Superadmin role required'})
            }
        }
    }
    catch (error)
    {
        return res.status(401).json({message: 'Unauthorized'})
    }
}


// Function investor check
export const isInvestor = async (req, res, next) =>
{
    try
    {
        const bearerHeader = req.headers['authorization']

        if (!bearerHeader)
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
    
        else
        {
            const bearerHeaderSplit = bearerHeader.split(' ', 2)
            const token = bearerHeaderSplit[1]

            const decoded = jwt.verify(token, 'secret')

            const userInSession = await User.findOne({ _id: decoded.id })

            if (!userInSession)
                return res.status(401).json({message: 'Unauthorized: Invalid token'})
            
            else
            {
                if (userInSession.role.some(role => role === 'investor'))
                    next()

                else
                    return res.status(401).json({message: 'Unauthorized: Investor role required'})
            }
        }
    }
    catch (error)
    {
        return res.status(401).json({message: 'Unauthorized'})
    }
}


// Function promoter check
export const isPromoter = async (req, res, next) =>
{
    try
    {
        const bearerHeader = req.headers['authorization']

        if (!bearerHeader)
            return res.status(401).json({ message: 'Unauthorized: No token provided' })
    
        else
        {
            const bearerHeaderSplit = bearerHeader.split(' ', 2)
            const token = bearerHeaderSplit[1]

            const decoded = jwt.verify(token, 'secret')

            const userInSession = await User.findOne({ _id: decoded.id })

            if (!userInSession)
                return res.status(401).json({message: 'Unauthorized: Invalid token'})
            
            else
            {
                if (userInSession.role.some(role => role === 'promoter'))
                    next()

                else
                    return res.status(401).json({message: 'Unauthorized: Promoter role required'})
            }
        }
    }
    catch (error)
    {
        return res.status(401).json({message: 'Unauthorized'})
    }
}