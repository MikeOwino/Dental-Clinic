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

import CloseIcon from '@material-ui/icons/Cancel'
import DoneIcon from '@material-ui/icons/CheckCircle'

import HistoryIcon from '@material-ui/icons/History'

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginTop: 30
    },
    rejectIcon: {
        fill: "#ed4f1c",
        "&:hover": {
            fill: "#e24414"
        },
        marginLeft: "1%"
    },
    acceptIcon: {
        fill: "#8BE3D9",
        "&:hover": {
            fill: "#BEF4F4"
        },
        marginRight: "1%"
    },
    historyBtn: {
        width: 120,
        paddingBottom: 7,
        margin: 10,
        backgroundColor: "#ed4f1c",
        color: "#FFFFFF",
        '&:hover': {
            backgroundColor: "#e24414"
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

    async function handleAccept(id_req, id_patient) {
        const del = window.confirm("are you sure");
        if (del) await history.push({ pathname: `/create/appointment/patient/${id_req}/${id_patient}` });
    }

    async function handleReject(id_req) {
        try {
            await API.put(`request/${id_req}`, { status: "Rejected" }, {
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
                        data = data.filter(res => res.status === "Watting");
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
                    List Requests
                </Typography>


                <Link
                    onClick={() => history.push({ pathname: '/request/old' })}
                    className={classes.historyBtnLink}
                >

                    <Paper align="center" className={classes.historyBtn}>
                        <HistoryIcon className={classes.historyIcon} />
                        History
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
                            {requests.map(request => (
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
                                        <Link onClick={() => handleAccept(request.id, request.id_patient)}>
                                            <DoneIcon className={classes.acceptIcon} />
                                        </Link>

                                        <Link onClick={() => handleReject(request.id)}>
                                            <CloseIcon className={classes.rejectIcon} />
                                        </Link>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}