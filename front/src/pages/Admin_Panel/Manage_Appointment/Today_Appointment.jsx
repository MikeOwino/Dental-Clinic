import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import moment from "moment"
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

export default function Today_Appointment() {

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();
    const date = moment().format("YYYY-MM-DD");

    const [appointments, setAppointments] = useState([]);

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
                        const result = data.filter(d =>
                            moment(d.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
                            &&
                            d.status === "Waiting"
                        );
                        setAppointments(result);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function handleUpdate(id) {
        try {
            const del = window.confirm("are you sure");
            if (del) await API.put(`appointment/${id}`, { status: "Absent" }, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            });
            await fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function handleAccept(id_appointment, id_patient) {
        try {
            const del = window.confirm("are you sure");
            if (del) await history.push({ pathname: `/create/procedure/patient/${id_appointment}/${id_patient}` });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (

        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title row rowspacesp">
                        <div className="row">
                            <div className="col-sm-5">
                                <h2><b>Today's Appointments</b></h2>
                            </div>
                        </div>
                        <button onClick={() => history.push({ pathname: '/appointment/create' })}><i className="fa fa-plus"></i> Add New</button>
                        <button onClick={() => history.push({ pathname: '/appointment/history' })}>History</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Patient</th>
                                <th>Clinic</th>
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
                                    <td>{moment(appointment.start_at, "HH:mm").format("h:mm A")}</td>
                                    <td>{moment(appointment.end_at, "HH:mm").format("h:mm A")}</td>
                                    <td>{appointment.description}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        <a href=""
                                            onClick={() => handleAccept(appointment.id, appointment.id_patient)}
                                            className="settings"
                                            title="Settings"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE8B8;
                                            </i>
                                        </a>
                                        <a href="#"
                                            onClick={() => handleUpdate(appointment.id)}
                                            className="delete"
                                            title="Delete"
                                            data-toggle="tooltip"
                                        >
                                            <i className="material-icons">
                                                &#xE5C9;
                                            </i>
                                        </a>

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