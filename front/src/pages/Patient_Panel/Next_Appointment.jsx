import React, { useEffect, useState, useContext } from "react"
import API from "../../API"
import moment from "moment"
import SessionContext from '../../components/session/SessionContext'

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

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginTop: 30,
        marginBottom: 30,
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    }
}));

export default function Next_Appointment() {

    const classes = useStyles();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [appointment, setAppointment] = useState("");

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
                        let result = data.filter(d => d.status === "Waiting" && d.id_patient == id);
                        setAppointment(result[0]);
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
                    Next Appointment
                </Typography>

                <TableContainer component={Paper} style={{ marginTop: 20, width: 400 }}>
                    <Table>

                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>{moment(appointment.date).format("YYYY-MM-DD")}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Start</TableCell>
                            <TableCell>{moment(appointment.start_at, "HH:mm").format('h:mm A')}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>End</TableCell>
                            <TableCell>{moment(appointment.end_at, "HH:mm").format('h:mm A')}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Clinic</TableCell>
                            <TableCell>{appointment.name}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>{appointment.description}</TableCell>
                        </TableRow>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}