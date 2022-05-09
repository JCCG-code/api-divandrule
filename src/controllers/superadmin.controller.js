// General imports
import Asset from '../models/Asset'
import User from '../models/User'


// Get users on KYC checking state
export const verifyKYC = async (req, res) =>
{
    try
    {
        const users = await User.find({ KYCState: 1 })

        return res.status(200).json(users)
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}


// Receive users verified and update database
export const verifiedKYC = async (req, res) =>
{
    try
    {
        const id = req.body._id

        const user = await User.updateOne({_id: id}, {
            KYCState: 2
        })

        return res.status(200).json({message: 'success'})
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}


// Receive users verified and update database
export const deniedKYC = async (req, res) =>
{
    try
    {
        const id = req.body._id

        const user = await User.updateOne({_id: id}, {
            KYCState: -1
        })

        return res.status(200).json({message: 'success'})
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}


// Get users
export const getUsers = async (req, res) =>
{
    try
    {
        const users = User.find({}, (err, users) => {
            let userArray = []
            let userMap = {}

            for (const user of users)
            {
                userMap[user._id] = user

                let obj = {
                    _id: userMap[user._id]._id,
                    username: userMap[user._id].username,
                    email: userMap[user._id].email,
                    role: userMap[user._id].role
                }
                userArray.push(obj)
            }

            return res.status(200).json(userArray)
        })
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}

// Update user
export const updateUser = async (req, res) =>
{
    try
    {
        const { userId, username, email } = req.body

        const currentUser = await User.findById(userId)
        
        if (!currentUser)
            return res.status(400).json({message: 'User id was not found'})
        
        else
        {
            await User.updateOne({ _id: userId }, {
                username: username,
                email: email
            })

            return res.status(200).json({ message: 'Success' })
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}

// Delete user
export const deleteUser = async (req, res) =>
{
    try
    {
        const { userId, username, email } = req.body

        const currentUser = await User.findById(userId)
        
        if (!currentUser)
            return res.status(400).json({message: 'User id was not found'})
        
        else
        {
            await User.deleteOne({ _id: userId })

            return res.status(200).json({ message: 'Success' })
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}

export const approveAsset = async (req, res) =>
{
    try
    {
        const { acronym, state } = req.body
        
        await Asset.updateOne({ acronym: acronym }, {
            state: state
        })

        return res.status(200).json({ message: 'Success' })
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}