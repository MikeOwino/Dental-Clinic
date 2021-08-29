import React, { useState, useEffect, useContext } from "react"
import API from "../../API"
import SessionContext from '../../components/session/SessionContext'

export default function Patient_Panel() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        async function fetchData() {
            try {
                await API.post(`balanceData`, { id: id }, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        let data = res.data.result;
                        const success = res.data.success;
                        console.log(res);
                        if (success) {
                            let balance = (data.balance) ? data.balance : 0;
                            let payment = (data.payment) ? data.payment : 0;
                            setRemaining(balance - payment);
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return <h1>Remaining : {remaining}</h1>
}