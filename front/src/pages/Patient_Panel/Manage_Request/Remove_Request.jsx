import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import { Link } from "react-router-dom"
import moment from "moment"
import SessionContext from "../../../components/session/SessionContext"

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Container,
    Paper,
    CssBaseline,
    makeStyles,
    Typography
} from '@material-ui/core'

import DeleteIcon from '@material-ui/icons/Delete'

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginTop: 30
    },
    deleteIcon: {
        fill: "#ed4f1c",
        "&:hover": {
            fill: "#e24414"
        },
        marginLeft: "1%"
    }
}));

export default function Remove_Request() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [requests, setRequests] = useState([]);

    async function handleDelete(id_req) {
        try {
            await API.delete(`request/${id_req}`, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            });
            fetchData();
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function fetchData() {
        try {
            await API.get('request', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    let data = res.data.result;
                    console.log(data);
                    const success = res.data.success;
                    if (success) {
                        data = data.filter(res => res.status === "Waiting");
                        data = data.filter(res => res.id_patient === parseInt(id))
                        setRequests(data);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id])

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>

                <Typography variant="h3">
                    Requests
                </Typography>


                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Time</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {requests.map(request =>
                                <TableRow key={request.id}>

                                    <TableCell align="center">
                                        {moment(request.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(request.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {request.description}
                                    </TableCell>

                                    <TableCell align="center" className={classes.divRow}>
                                        <Link onClick={() => handleDelete(request.id)}>
                                            <DeleteIcon className={classes.deleteIcon} />
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}