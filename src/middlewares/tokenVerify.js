// General imports
import jwt from 'jsonwebtoken'
import User from '../models/User'


// Verify token for user session
export const verifyToken = async (req, res, next) =>
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
                //console.log(userInSession)
                //res.status(200).json({userSession: userInSession})
                next()
            }
        }
    }
    catch (error)
    {
        return res.status(401).json({message: 'Unauthorized'})
    }
}