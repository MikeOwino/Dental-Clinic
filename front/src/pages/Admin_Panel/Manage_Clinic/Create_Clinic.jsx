import React, { useState } from "react";
import { useHistory } from "react-router";
import API from "../../../API";

export default function Create_Clinic() {

    const history = useHistory();

    const [state, updateState] = useState({
        name: "",
        err: ""
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let reqBody = state;
            await API.get(`clinic`)
                .then(async res => {
                    const result = res.data.result;
                    const isClinic = result.find(r => r.name === state.name);
                    if (isClinic) setState({ err: "This clinic alredy exist" });
                    if (!isClinic) {
                        await API.post(`clinic`, reqBody);
                        await history.push({ pathname: '/clinic/list' })
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <div>
            <h1>ADD CLINIC</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name clinic"
                    value={state.name}
                    onChange={handleChange}
                />
                <span>{state.err}</span>

                <button type="submit">ADD</button>
            </form>
        </div>
    )
}