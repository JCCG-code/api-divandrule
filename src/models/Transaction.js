// General imports
import { Schema, model } from 'mongoose'


// Schema creation
const transactionSchema = new Schema({
    investor: {
        type: String,
        required: true
    },
    contractAddress: {
        type: String,
        required: true
    },
    numberTokens: {
        type: Number,
        required: true
    },
    dateRegister: {
        type: Date,
        required: true
    },
    datesClaim: [
        {
            date: {
                type: Date
            },
            isClaim: {
                type: String
            },
            nMonth: {
                type: Number
            }
        }
    ]
}, {
    versionKey: false
})


// Export user schema
export default model('Transaction', transactionSchema)