// General imports
import { Schema, model } from 'mongoose'


// Schema creation
const assetSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    acronym: {
        type: String,
        unique: true
    },
    type_of_payment: {
        type: String,
    },
    interest: {
        type: Number,
    },
    monthsDuration: {
        type: Number
    },
    totalSupply: {
        type: Number,
        required: true
    },
    interestSupply: {
        type: Number,
        required: true
    },
    availableSupply: {
        type: Number
    },
    whitepaper: {
        type: String,
        required: true
    },
    brochure: {
        type: String,
        required: true
    },
    legacy_docs: {
        type: String,
        required: true
    },
    usernameOwner: {
        type: String,
        required: true
    },
    ownerAddress: {
        type: String,
    },
    contractAddress: {
        type: String,
    },
    dateDeploy: {
        type: Date,
    },
    dateFinish: {
        type: Date,
    },
    state: {
        type: Number,
        required: true
    },

    // Contract's transactions
    transactions: [
        {
            type: Schema.Types.ObjectId, ref: 'Transaction'
        }
    ]

}, {
    versionKey: false
})


// Export user schema
export default model('Asset', assetSchema)