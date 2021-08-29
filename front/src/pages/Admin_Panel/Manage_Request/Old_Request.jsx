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

import CachedIcon from '@material-ui/icons/Cached'

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
    },
    historyBtn: {
        width: 155,
        paddingBottom: 7,
        margin: 10,
        backgroundColor: "#FFFFFF",
        color: "#8BE3D9",
        '&:hover': {
            color: "#FFFFFF",
            backgroundColor: "#8BE3D9"
        }
    },
    historyBtnLink: {
        textDecoration: "none",
        fontSize: 16
    },
    historyIcon: {
        position: "relative",
        top: 6,
        right: 10
    }
}));

export default function List_Request() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [requests, setRequests] = useState([]);

    async function handleDelete(id_req) {
        try {
            const del = window.confirm("are you sure");
            if (del) await API.delete(`request/${id_req}`, {
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
            await API.get('RP', {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(res => {
                    let data = res.data.result;
                    const success = res.data.success;
                    if (success) {
                        data = data.filter(res => res.status !== "Watting");
                        setRequests(data);
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>

                <Typography variant="h3">
                    History Requests
                </Typography>


                <Link
                    onClick={() => history.push({ pathname: '/request/list' })}
                    className={classes.historyBtnLink}
                >
                    <Paper align="center" className={classes.historyBtn}>
                        <CachedIcon className={classes.historyIcon} />
                        New Requests
                    </Paper>
                </Link>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell align="center">ID</TableCell>
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">Description</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Time</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {requests.map(request =>
                                <TableRow key={request.id}>

                                    <TableCell>
                                        {request.id_patient}
                                    </TableCell>

                                    <TableCell align="center">
                                        {request.first_name} {request.middle_name} {request.last_name}
                                    </TableCell>

                                    <TableCell align="center">
                                        {request.description}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(request.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(request.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {request.status}
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