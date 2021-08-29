import React, { useState, useEffect, useContext } from "react"
import API from "../API"
import SessionContext from "./session/SessionContext"

import { TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

export default function Teeth(props) {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [teeth, setTeeth] = useState([]);

    useEffect(() => {
        async function fetchData() {
            if (props.category && props.category != "") {
                let reqBody = {
                    category: props.category
                }
                await API.post(`tooth`, reqBody, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        setTeeth(result);
                        console.log({result});
                    });
            } else {
                setTeeth([]);
            }
        }
        fetchData();
    }, [props.category])

    return (
        <Autocomplete
            options={teeth}
            getOptionLabel={(option) =>  option.id}
            // defaultvalue={teeth.find(t => t.id == props.value)}
            // defaultValue={props.value}
            variant="outlined"
            onChange={props.onChange}
            renderInput={(params) =>
                <TextField
                    fullWidth
                    {...params}
                    variant="outlined"
                    label="Tooth"
                    className={props.className}
                />
            }
        />
    )
}