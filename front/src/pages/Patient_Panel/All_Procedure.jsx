import React, { useState, useEffect, useContext } from "react"
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
        marginBottom: 30
    }
}));

export default function All_Procedure() {

    const classes = useStyles();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [procedures, setProcedures] = useState([]);
    const [works, setWorks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get('PTCDP', {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const success = res.data.success;
                        if (success)
                            setWorks(result);
                    });

                await API.get('PDP', {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const data = result.filter(r => r.id_patient == id);
                        let proc = [];
                        data.map(d =>
                            proc.push({
                                id_procedure: d.id,
                                f_n_doctor: d.f_n_doctor,
                                m_n_doctor: d.m_n_doctor,
                                l_n_doctor: d.l_n_doctor,
                                date: d.date,
                                payment: (d.payment && d.payment != "" && d.payment != 0) ? d.payment : 0
                            })
                        );
                        setProcedures(proc);
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>

                <Typography variant="h3">
                    Procedures
                </Typography>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Hours</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell align="center">Payment</TableCell>
                                <TableCell align="center">Tooth</TableCell>
                                <TableCell align="center">Act</TableCell>
                                <TableCell align="center">Price</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {procedures.map((procedure, i = 1) =>
                                <TableRow key={procedure.id}>

                                    <TableCell>
                                        {i += 1}
                                    </TableCell>

                                    <TableCell>
                                        {moment(procedure.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell>
                                        {moment(procedure.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {procedure.f_n_doctor} {procedure.m_n_doctor} {procedure.l_n_doctor}
                                    </TableCell>

                                    <TableCell align="center">
                                        {procedure.payment}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {(work.id_teeth == 1 || work.id_teeth == 2) ? "All" : work.id_teeth}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <div key={work.id}>
                                                <span>
                                                    {work.description}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id_procedure).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {work.price}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
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