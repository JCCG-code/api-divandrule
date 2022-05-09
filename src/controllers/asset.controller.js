// General imports
import Asset from '../models/Asset'
import User from '../models/User'
import Transaction from '../models/Transaction'


// Get assets function
export const getAssets = (req, res) =>
{
    const assets = Asset.find({}, (err, assets) => {
        let assetsMap = {}

        assets.forEach(asset => {
            assetsMap[asset._id] = asset
        })

        return res.status(200).json(assetsMap)
    })
}

export const newAsset = async (req, res) =>
{
    try
    {
        const { username, assetName, assetDescription, acronym, type_of_payment, interest, monthsDuration, totalSupply, state } = req.body
        const { whitepaper, brochure, legacy_docs } = req.files

        const newAsset = await new Asset({
            name: assetName,
            description: assetDescription,
            acronym: acronym,
            type_of_payment: type_of_payment,
            interest: interest,
            monthsDuration: monthsDuration,
            totalSupply: totalSupply,
            interestSupply: totalSupply * (interest/100),
            availableSupply: totalSupply,
            whitepaper: whitepaper[0].path,
            brochure: brochure[0].path,
            legacy_docs: legacy_docs[0].path,
            usernameOwner: username,
            state: state
        }).save()

        const currentUser = await User.findOne({ username: username})
        currentUser.contracts.push(newAsset._id)

        currentUser.save()

        return res.status(200).json({ message: 'Asset was saved' })
    }
    catch(err)
    {
        return res.status(400).json(err)
    }
}


export const deployToken = async (req, res) =>
{
    try
    {
        const { acronym, dateDeploy, dateFinish, contractAddress, userAddress, state } = req.body

        await Asset.updateOne({ acronym: acronym }, {
            dateDeploy: dateDeploy,
            dateFinish: dateFinish,
            contractAddress: contractAddress,
            ownerAddress: userAddress,
            state: state
        })

        return res.status(200).json({ message: 'Success' })
    }
    catch(err)
    {
        return res.status(400).json(err) 
    }
}


export const buyTokenByAsset = async (req, res) =>
{
    try
    {
        const { username, investor, contractAddress, numberTokens, tokensUser, dateTransaction } = req.body
        
        const currentAsset = await Asset.findOne({ contractAddress: contractAddress })
        const currentUser = await User.findOne({ username: username })

        if (!currentAsset)
            return res.status(409).json({ message: 'Asset does not exist' })
        
        else if (!currentUser)
            return res.status(409).json({ message: 'Investor does not exist' })
        
        else
        {
            let datesClaim = [
                {
                    date: null,
                    isClaim: '',
                    nMonth: null,
                }
            ]

            datesClaim[0].date = new Date(currentAsset.dateDeploy)
            datesClaim[0].isClaim = ''

            let auxDateRegister = new Date(dateTransaction)
            let i = 0

            if (currentAsset.type_of_payment == 'monthly')
            {
                while (datesClaim[i].date < currentAsset.dateFinish)
                {
                    let auxDate, auxIsClaim

                    auxDate = new Date(datesClaim[i].date)
                    auxDate.setMonth(auxDate.getMonth()+1)

                    if (auxDate < auxDateRegister)
                    {
                        auxIsClaim = '-'
                    } else {
                        auxIsClaim = 'Soon'
                    }

                    let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i+1 }
                    datesClaim.push(newDate)

                    i++
                }

                // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                if ((currentAsset.monthsDuration % 1) > 0) {
                    datesClaim.pop()
                }
            }
            else if (currentAsset.type_of_payment == 'quarterly')
            {
                while (datesClaim[i].date < currentAsset.dateFinish)
                {
                    let auxDate, auxIsClaim

                    auxDate = new Date(datesClaim[i].date)
                    auxDate.setMonth(auxDate.getMonth()+3)

                    if (auxDate < auxDateRegister)
                    {
                        auxIsClaim = '-'
                    } else {
                        auxIsClaim = 'Soon'
                    }

                    let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*3+3 }
                    datesClaim.push(newDate)

                    i++
                }

                // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                if ((currentAsset.monthsDuration % 3) > 0) {
                    datesClaim.pop()
                }
            }
            else if (currentAsset.type_of_payment == 'biannual')
            {
                while (datesClaim[i].date < currentAsset.dateFinish)
                {
                    let auxDate, auxIsClaim

                    auxDate = new Date(datesClaim[i].date)
                    auxDate.setMonth(auxDate.getMonth()+6)

                    if (auxDate < auxDateRegister)
                    {
                        auxIsClaim = '-'
                    } else {
                        auxIsClaim = 'Soon'
                    }

                    let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*6+6 }
                    datesClaim.push(newDate)

                    i++
                }

                // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                if ((currentAsset.monthsDuration % 6) > 0) {
                    datesClaim.pop()
                }
            }
            else if (currentAsset.type_of_payment == 'annual')
            {
                while (datesClaim[i].date < currentAsset.dateFinish)
                {
                    let auxDate, auxIsClaim

                    auxDate = new Date(datesClaim[i].date)
                    auxDate.setMonth(auxDate.getMonth()+12)

                    if (auxDate < auxDateRegister)
                    {
                        auxIsClaim = '-'
                    } else {
                        auxIsClaim = 'Soon'
                    }

                    let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*12+12 }
                    datesClaim.push(newDate)

                    i++
                }

                // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                if ((currentAsset.monthsDuration % 12) > 0) {
                    datesClaim.pop()
                }
            }
            else
            {
                let auxDate, auxIsClaim
                auxDate = new Date(currentAsset.dateFinish)

                if (auxDate < auxDateRegister)
                {
                    auxIsClaim = '-'
                } else {
                    auxIsClaim = 'Soon'
                }

                let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: currentAsset.monthsDuration }
                datesClaim.push(newDate)
            }

            const newTransaction = await new Transaction({
                investor: investor,
                contractAddress: contractAddress,
                numberTokens: numberTokens,
                datesClaim: datesClaim,
                dateRegister: dateTransaction
            }).save()

            // Save transaction in asset
            currentAsset.transactions.push(newTransaction._id)

            // Updating supply token
            await Asset.updateOne({ contractAddress: contractAddress },{
                availableSupply: currentAsset.availableSupply - numberTokens
            })

            currentAsset.save()

            return res.status(200).json({ message: 'Buy token success' })
        }
    }
    catch(err)
    {
        return res.status(400).json(err)
    }
}

export const claimTokenByAsset = async (req, res) =>
{
    try
    {
        const { datesClaim } = req.body

        const currentAsset = await Asset.findOne({ contractAddress: req.body.contractAddress })
        const currentTransaction = await Transaction.findOne({ investor: req.body.investor, contractAddress: req.body.contractAddress, dateRegister: req.body.dateRegister })

        if (!currentAsset)
            return res.status(409).json({ message: 'Asset does not exist' })

        else if (!currentTransaction)
            return res.status(409).json({ message: 'Transaction does not exist' })

        else
        {
            if (req.body.claimAmount <= currentAsset.availableSupply)
            {
                let object = datesClaim

                for (let i = 0; i < object.length; i++)
                {
                    if (object[i].isClaim != '-' && object[i].isClaim != 'Soon')
                    {
                        object[i].isClaim = 'Claimed'
                    }
                }

                await Transaction.updateOne({ investor: req.body.investor, contractAddress: req.body.contractAddress, dateRegister: req.body.dateRegister }, {
                    datesClaim: object
                })

                await Asset.updateOne({ contractAddress: req.body.contractAddress },{
                    interestSupply: currentAsset.interestSupply - req.body.claimAmount
                })

                return res.status(200).json({ message: 'Tokens claimed' })
            }
            else
            {
                return res.status(400).json({ message: 'Insufficient interest supply' })
            }
        }
    }
    catch (err)
    {
        return res.status(400).json(err)
    }
}