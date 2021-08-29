import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

export default function Today_Appointment() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory()

    const [appointments, setAppointments] = useState([]);

    const [state, updateState] = useState({
        date: "",
        status: ""
    })

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

    async function fetchData() {
        try {
            await API.get('ACP', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        let result = data.filter(d => d.status !== "Waiting");
                        if (state.date && state.date !== "")
                            result = result.filter(d => d.start_at.substring(0, 10) === state.date);
                        if (state.status && state.status !== "")
                            result = result.filter(d => d.status === state.status);
                        setAppointments(result);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [JSON.stringify(state)])

    return (

        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>History Appointments</b></h2>
                            </div>
                        </div>
                        <button onClick={() => history.push({ pathname: '/appointment/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <input
                        type="date"
                        name="date"
                        value={state.date}
                        onChange={handleChange}
                    />

                    <input
                        checked={state.status === ''}
                        type="radio"
                        name="status"
                        id="all"
                        value=""
                        onChange={handleChange}
                    />
                    <label for="all">All</label>
                    <input
                        checked={state.status === 'Present'}
                        type="radio"
                        name="status"
                        id="present"
                        value="Present"
                        onChange={handleChange}
                    />
                    <label for="present">Present</label>
                    <input
                        checked={state.status === 'Absent'}
                        type="radio"
                        name="status"
                        id="absent"
                        value="Absent"
                        onChange={handleChange}
                    />
                    <label for="absent">Absent</label>



                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Clinic</th>
                                <th>Date</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Description</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.first_name} {appointment.middle_name} {appointment.last_name}</td>
                                    <td>{appointment.name}</td>
                                    <td>{moment(appointment.date).format("YYYY-MM-DD")}</td>
                                    <td>{moment(appointment.start_at, "HH:mm").format('h:mm A')}</td>
                                    <td>{moment(appointment.end_at, "HH:mm").format('h:mm A')}</td>
                                    <td>{appointment.description}</td>
                                    <td>{appointment.status}</td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}