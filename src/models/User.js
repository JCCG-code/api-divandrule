import { Schema, model } from 'mongoose'


// Schema creation
const userSchema = new Schema({

    // Basic data client
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

    // KYC authentication
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    birthday: {
        type: Date
    },
    mobileprefix: {
        type: String
    },
    mobile: {
        type: Number
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    postalcode: {
        type: Number
    },
    address: {
        type: String
    },
    nationality: {
        type: String
    },

    // Images for KYC authentication
    obverseDNI: {
        type: String
    },
    reverseDNI: {
        type: String
    },
    selfie: {
        type: String
    },

    // State of KYC authentication (0: KYC no data, 1: checking, 2: checked)
    KYCState: {
        type: Number
    },

    // Investor, promoter or superadmin role
    role: [{
        type: String
    }],

    // User's contracts
    contracts: [
        {
            type: Schema.Types.ObjectId, ref: 'Asset'
        },
    ]
}, {
    timestamps: true,
    versionKey: false
})


// Export user schema
export default model('User', userSchema)