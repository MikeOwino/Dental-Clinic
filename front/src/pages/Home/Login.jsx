import React, { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import API from '../../API'
import { setCookie } from '../../cookie'
import SessionContext from '../../components/session/SessionContext'

export default function Login() {

    const history = useHistory();

    const [state, updateState] = useState({
        username: "",
        password: "" 
    });

    let { actions: { setSession } } = useContext(SessionContext);

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
            await API.post('login', state)
                .then(res => {
                    const answer = res.data.result;
                    if (answer) {
                        if (answer.isAdmin || answer.isAdmin == true) {

                            let user = {
                                id: answer.admin.id,
                                username: state.username,
                                token: answer.token,
                                isAdmin: answer.isAdmin,
                                role_id: `${answer.admin.role_id}`
                            }

                            setCookie('token', answer.token, 30);
                            setCookie('username', state.username, 30);
                            setCookie('id', answer.admin.id, 30);
                            setCookie('isAdmin', answer.isAdmin, 30);
                            setCookie('role_id', `${answer.admin.role_id}`, 30);
                            setSession({ user });
                        }
                        else if (!answer.isAdmin || answer.isAdmin == false) {

                            let user = {
                                id: answer.patient.id,
                                username: state.username,
                                token: answer.token,
                                isAdmin: answer.isAdmin
                            }

                            setCookie('token', answer.token, 30);
                            setCookie('username', state.username, 30);
                            setCookie('id', answer.patient.id, 30);
                            setCookie('isAdmin', answer.isAdmin, 30);
                            setSession({ user });
                        }
                    } else {
                        setState({ username: "", password: "" });
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <form onSubmit={handleSubmit}>

            <input
                type='text'
                name="username"
                value={state.username}
                onChange={handleChange}
            />

            <input
                type='password'
                name="password"
                value={state.password}
                onChange={handleChange}
            />

            <button type="submit">Login</button>
            <Link to="/register">Register</Link>
        </form>
    )
}