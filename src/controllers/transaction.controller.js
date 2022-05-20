// General imports
import Transaction from '../models/Transaction'
import Asset from '../models/Asset'


// Get transactions function
export const getTransactions = (req, res) =>
{
    const transactions = Transaction.find({}, async (err, transactions) => {
        let transactionsMap = {}
        let transactionsArray = []

        for (const transaction of transactions) { // Reading in sequence
            transactionsMap[transaction._id] = transaction

            let contract = await Asset.findOne({ contractAddress: transactionsMap[transaction._id].contractAddress })

            if (contract)
            {
                let datesClaim = [
                    {
                        date: null,
                        isClaim: '',
                        nMonth: null,
                    }
                ]

                datesClaim[0].date = new Date(contract.dateDeploy)
                datesClaim[0].isClaim = ''

                // Variate dateTransaction and dateNow for TESTING
                let auxDateRegister = new Date(transactionsMap[transaction._id].dateRegister)
                let dateNow = new Date(Date.now())
                //auxDateRegister.setMonth(auxDateRegister.getMonth()+5)
                //dateNow.setMonth(dateNow.getMonth()+3)

                // Calculate claim amount
                let investmentAmount = transactionsMap[transaction._id].numberTokens
                let interestPerMonth = contract.interest/contract.monthsDuration
                let claimAmount

                let i = 0
                let cont = 0

                if (contract.type_of_payment == 'monthly')
                {
                    while (datesClaim[i].date < contract.dateFinish)
                    {
                        let auxDate, auxIsClaim

                        auxDate = new Date(datesClaim[i].date)
                        auxDate.setMonth(auxDate.getMonth()+1)

                        // Si la fecha de cobro mensual es menor que la fecha de la transacción,
                        // significa que la fecha de cobro se ha pasado, por lo que el usuario está
                        // fuera de rango para reclamar sus tokens
                        if (auxDate < auxDateRegister)
                        {
                            auxIsClaim = '-'
                        }
                        // Si la transacción fue realizada antes de una fecha de cobro, y esa fecha de
                        // cobro es menor que la fecha actual, significa que ha pasado esa fecha de cobro
                        // donde el usuario puede reclamar sus tokens
                        else if (auxDateRegister < auxDate && auxDate < dateNow)
                        {
                            if (transactionsMap[transaction._id].datesClaim[i].isClaim == 'Claimed') {
                                auxIsClaim = 'Claimed'
                            } else {
                                auxIsClaim = '+'+parseFloat(((investmentAmount*(1+interestPerMonth/100))-investmentAmount).toFixed(4))
                                cont++
                            }
                        }
                        // Si entra aquí significa que Date.now() es menor que algún mes de cobro, por lo que
                        // el usuario aún no puede reclamar sus tokens
                        else
                        {
                            auxIsClaim = 'Soon'
                        }

                        let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i+1 }
                        datesClaim.push(newDate)

                        i++
                    }

                    // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                    if ((contract.monthsDuration % 1) > 0) {
                        datesClaim.pop()
                    }

                    claimAmount = ((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*cont
                }
                else if (contract.type_of_payment == 'quarterly')
                {
                    while (datesClaim[i].date < contract.dateFinish)
                    {
                        let auxDate, auxIsClaim

                        auxDate = new Date(datesClaim[i].date)
                        auxDate.setMonth(auxDate.getMonth()+3)

                        // Si la fecha de cobro mensual es menor que la fecha de la transacción,
                        // significa que la fecha de cobro se ha pasado, por lo que el usuario está
                        // fuera de rango para reclamar sus tokens
                        if (auxDate < auxDateRegister)
                        {
                            auxIsClaim = '-'
                        }
                        // Si la transacción fue realizada antes de una fecha de cobro, y esa fecha de
                        // cobro es menor que la fecha actual, significa que ha pasado esa fecha de cobro
                        // donde el usuario puede reclamar sus tokens
                        else if (auxDateRegister < auxDate && auxDate < dateNow)
                        {
                            if (transactionsMap[transaction._id].datesClaim[i].isClaim == 'Claimed') {
                                auxIsClaim = 'Claimed'
                            } else {
                                auxIsClaim = '+'+parseFloat((((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*3).toFixed(4))
                                cont++
                            }
                        }
                        // Si entra aquí significa que Date.now() es menor que algún mes de cobro, por lo que
                        // el usuario aún no puede reclamar sus tokens
                        else
                        {
                            auxIsClaim = 'Soon'
                        }

                        let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*3+3 }
                        datesClaim.push(newDate)

                        i++
                    }

                    // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                    if ((contract.monthsDuration % 3) > 0) {
                        datesClaim.pop()
                    }

                    claimAmount = ((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*cont*3
                }
                else if (contract.type_of_payment == 'biannual')
                {
                    while (datesClaim[i].date < contract.dateFinish)
                    {
                        let auxDate, auxIsClaim

                        auxDate = new Date(datesClaim[i].date)
                        auxDate.setMonth(auxDate.getMonth()+6)

                        // Si la fecha de cobro mensual es menor que la fecha de la transacción,
                        // significa que la fecha de cobro se ha pasado, por lo que el usuario está
                        // fuera de rango para reclamar sus tokens
                        if (auxDate < auxDateRegister)
                        {
                            auxIsClaim = '-'
                        }
                        // Si la transacción fue realizada antes de una fecha de cobro, y esa fecha de
                        // cobro es menor que la fecha actual, significa que ha pasado esa fecha de cobro
                        // donde el usuario puede reclamar sus tokens
                        else if (auxDateRegister < auxDate && auxDate < dateNow)
                        {
                            if (transactionsMap[transaction._id].datesClaim[i].isClaim == 'Claimed') {
                                auxIsClaim = 'Claimed'
                            } else {
                                auxIsClaim = '+'+parseFloat((((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*6).toFixed(4))
                                cont++
                            }
                        }
                        // Si entra aquí significa que Date.now() es menor que algún mes de cobro, por lo que
                        // el usuario aún no puede reclamar sus tokens
                        else
                        {
                            auxIsClaim = 'Soon'
                        }

                        let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*6+6 }
                        datesClaim.push(newDate)

                        i++
                    }

                    // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                    if ((contract.monthsDuration % 6) > 0) {
                        datesClaim.pop()
                    }

                    claimAmount = ((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*cont*6
                }
                else if (contract.type_of_payment == 'annual')
                {
                    while (datesClaim[i].date < contract.dateFinish)
                    {
                        let auxDate, auxIsClaim

                        auxDate = new Date(datesClaim[i].date)
                        auxDate.setMonth(auxDate.getMonth()+12)

                        // Si la fecha de cobro mensual es menor que la fecha de la transacción,
                        // significa que la fecha de cobro se ha pasado, por lo que el usuario está
                        // fuera de rango para reclamar sus tokens
                        if (auxDate < auxDateRegister)
                        {
                            auxIsClaim = '-'
                        }
                        // Si la transacción fue realizada antes de una fecha de cobro, y esa fecha de
                        // cobro es menor que la fecha actual, significa que ha pasado esa fecha de cobro
                        // donde el usuario puede reclamar sus tokens
                        else if (auxDateRegister < auxDate && auxDate < dateNow)
                        {
                            if (transactionsMap[transaction._id].datesClaim[i].isClaim == 'Claimed') {
                                auxIsClaim = 'Claimed'
                            } else {
                                auxIsClaim = '+'+parseFloat((((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*12).toFixed(4))
                                cont++
                            }
                        }
                        // Si entra aquí significa que Date.now() es menor que algún mes de cobro, por lo que
                        // el usuario aún no puede reclamar sus tokens
                        else
                        {
                            auxIsClaim = 'Soon'
                        }

                        let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: i*12+12 }
                        datesClaim.push(newDate)

                        i++
                    }

                    // Si el resto no es cero, tenemos que eliminar el ultimo mes añadido
                    if ((contract.monthsDuration % 12) > 0) {
                        datesClaim.pop()
                    }

                    claimAmount = ((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*cont*12
                }
                else
                {
                    let auxDate, auxIsClaim

                    auxDate = new Date(contract.dateFinish)

                    // Si la fecha de cobro mensual es menor que la fecha de la transacción,
                    // significa que la fecha de cobro se ha pasado, por lo que el usuario está
                    // fuera de rango para reclamar sus tokens
                    if (auxDate < auxDateRegister)
                    {
                        auxIsClaim = '-'
                    }
                    // Si la transacción fue realizada antes de una fecha de cobro, y esa fecha de
                    // cobro es menor que la fecha actual, significa que ha pasado esa fecha de cobro
                    // donde el usuario puede reclamar sus tokens
                    else if (auxDateRegister < auxDate && auxDate < dateNow)
                    {
                        if (transactionsMap[transaction._id].datesClaim[i].isClaim == 'Claimed') {
                            auxIsClaim = 'Claimed'
                        } else {
                            auxIsClaim = '+'+parseFloat((((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*contract.monthsDuration).toFixed(4))
                            cont++
                        }
                    }
                    // Si entra aquí significa que Date.now() es menor que algún mes de cobro, por lo que
                    // el usuario aún no puede reclamar sus tokens
                    else
                    {
                        auxIsClaim = 'Soon'
                    }

                    let newDate = { date: auxDate, isClaim: auxIsClaim, nMonth: contract.monthsDuration }
                    datesClaim.push(newDate)

                    claimAmount = ((investmentAmount*(1+interestPerMonth/100))-investmentAmount)*cont*contract.monthsDuration
                }

                datesClaim.shift()

                let obj = {
                    investor: transactionsMap[transaction._id].investor,
                    contractAddress: transactionsMap[transaction._id].contractAddress,
                    numberTokens: investmentAmount,
                    dateRegister: transactionsMap[transaction._id].dateRegister,
                    tokenTitle: 'Token ' + contract.acronym + ' (' + contract.name + ')',
                    interestToken: contract.interest,
                    acronymToken: contract.acronym,
                    datesClaim: datesClaim,
                    claimAmount: parseFloat(claimAmount.toFixed(4)),
                    dateTransactionTest: auxDateRegister,
                    dateNowTest: dateNow
                }
                transactionsArray.push(obj)

                await Transaction.updateOne({ _id: transactionsMap[transaction._id]._id }, {
                    datesClaim: datesClaim
                })
            }
        }

        return res.status(200).json(transactionsArray)
    })
}