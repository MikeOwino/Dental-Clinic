import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

import ConfirmDelete from "../../../components/ConfirmDelete"

export default function Upcoming_Appointment() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();

    const [appointments, setAppointments] = useState([]);
    const [date, setDate] = useState("")

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
                        let result = data.filter(d => d.status === "Waiting");
                        if (date && date !== "") result = result.filter(d => d.date.substring(0, 10) === date);
                        setAppointments(result);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [date])

    return (

        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>Upcoming Appointments</b></h2>
                            </div>
                        </div>
                        <button onClick={() => history.push({ pathname: '/appointment/create' })}><i className="fa fa-plus"></i> Add New</button>
                        <button onClick={() => history.push({ pathname: '/appointment/history' })}>History</button>
                    </div>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
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
                                <th>Manage</th>
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
                                    <td>
                                        <a href=""
                                            onClick={() => history.push({ pathname: `/appointment/edit/${appointment.id}` })}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <ConfirmDelete
                                            path={`appointment/${appointment.id}`}
                                            name="appointment"
                                            fetchData={fetchData}
                                        />
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}