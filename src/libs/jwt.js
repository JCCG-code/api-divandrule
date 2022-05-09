// General imports
import jwt from 'jsonwebtoken'


// Function to provide user token
export const generateTokenById = (userId) =>
{
    return jwt.sign({ id: userId }, 'secret', { expiresIn: 86400 })
}