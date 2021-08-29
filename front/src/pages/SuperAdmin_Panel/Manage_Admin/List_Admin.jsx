import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

import ConfirmDelete from '../../../components/ConfirmDelete'

export default function List_Admin() {

    const history = useHistory();
    const [admins, setAdmins] = useState([]);

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);
    
    console.log({ id, token });
    async function fetchData() {
        try {
            await API.get('admin', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    const data = res.data.result;
                    const success = res.data.success;
                    if (success)
                        setAdmins(data);
                });
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
                                <h2><b>Admin</b></h2>
                            </div>
                        </div>
                        <button onClick={() => history.push({ pathname: '/admin/create' })}><i className="fa fa-plus"></i> Add New</button>
                    </div>

                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Phone</th>
                                <th>Manage</th>
                            </tr>
                        </thead>
                        <tbody>

                            {admins.map(admin => (
                                <tr key={admin.id}>
                                    <td>{admin.id}</td>
                                    <td>{admin.first_name} {admin.middle_name} {admin.last_name}</td>
                                    <td>{admin.username}</td>
                                    <td>{admin.phone}</td>
                                    <td>
                                        <a href="" onClick={() => history.push({ pathname: `/admin/edit/${admin.id}` })} className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons">&#xE8B8;</i></a>
                                        <ConfirmDelete
                                            path={`admin/${admin.id}`}
                                            name="admin"
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