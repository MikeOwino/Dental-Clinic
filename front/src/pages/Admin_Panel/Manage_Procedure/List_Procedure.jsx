import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import { Link } from "react-router-dom"
import API from "../../../API"
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
    Typography,
    IconButton
} from '@material-ui/core'

import AddBoxIcon from '@material-ui/icons/AddBox'
import EditIcon from '@material-ui/icons/Edit'

import ConfirmDelete from "../../../components/ConfirmDelete"

const useStyles = makeStyles((theme) => ({
    container: {
        width: "100%",
        margin: 5,
        marginTop: 30,
        marginBottom: 30
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    root: {
        '& label.Mui-focused': {
            color: theme.palette.primary.main,
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.palette.primary.main,
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&:hover fieldset': {
                borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main,
            },
        },
        '& .MuiFormHelperText-contained': {
            display: "none"
        },
        '& label': {
            color: "#8BE3D9 !important",
        },
        '& .PrivateNotchedOutline-root-28': {
            borderColor: "#8BE3D9 !important",
        }
    },
    ddBoxIconBtn: {
        width: 160,
        padding: 6,
        paddingBottom: 10,
        margin: 10,
        backgroundColor: "#FFFFFF",
        color: "#8BE3D9",
        '&:hover': {
            color: "#FFFFFF",
            backgroundColor: "#8BE3D9"
        }
    },
    ddBoxIconBtnLink: {
        width: 160,
        textDecoration: "none",
        fontSize: 16
    },
    ddBoxIcon: {
        position: "relative",
        top: 6,
        right: 10
    },
    widthBtn: {
        width: 20
    },
    editIcon: {
        color: "#8BE3D9",
        '&:hover': {
            color: "#BEF4F4"
        }
    },
    deleteIcon: {
        color: "#ed4f1c",
        '&:hover': {
            color: "#e24414"
        }
    }
}));

export default function List_Procedure() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [procedures, setProcedures] = useState([]);
    const [works, setWorks] = useState([]);

    async function fetchData() {
        try {
            await API.get('PDP', {
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
                        setProcedures(result);
                });

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
                    Procedures
                </Typography>


                <Link
                    onClick={() => history.push({ pathname: '/procedure/create' })}
                    className={classes.ddBoxIconBtnLink}
                >

                    <Paper align="center" className={classes.ddBoxIconBtn}>
                        <AddBoxIcon className={classes.ddBoxIcon} />
                        Add Procedure
                    </Paper>
                </Link>

                <TableContainer component={Paper}>
                    <Table>

                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Time</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell>Doctor</TableCell>
                                <TableCell align="center">Payment</TableCell>
                                <TableCell align="center">Tooth</TableCell>
                                <TableCell align="center">Act</TableCell>
                                <TableCell align="center">Price</TableCell>
                                <TableCell align="center">Manage</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {procedures.map(procedure =>
                                <TableRow key={procedure.id}>

                                    <TableCell align="center">
                                        {moment(procedure.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {moment(procedure.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell>
                                        {procedure.f_n_patient} {procedure.m_n_patient} {procedure.l_n_patient}
                                    </TableCell>

                                    <TableCell>
                                        {procedure.f_n_doctor} {procedure.m_n_doctor} {procedure.l_n_doctor}
                                    </TableCell>

                                    <TableCell align="center">
                                        {procedure.payment}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {(work.id_teeth == 1 || work.id_teeth == 2) ? "All" : work.id_teeth}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span>
                                                    {work.description}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>

                                    <TableCell align="center">
                                        {works.filter(work => work.id_procedure == procedure.id).map(work => (
                                            <div key={work.id}>
                                                <span key={work.id}>
                                                    {work.price}
                                                </span>
                                                <br />
                                            </div>
                                        ))}
                                    </TableCell>


                                    <TableCell align="center">
                                        <Link
                                            onClick={() => history.push({ pathname: `/procedure/edit/${procedure.id}` })}
                                            className={classes.widthBtn}
                                        >
                                            <IconButton>
                                                <EditIcon className={classes.editIcon} />
                                            </IconButton>
                                        </Link>

                                        <ConfirmDelete
                                            path={`procedure/${procedure.id}`}
                                            name="procedure"
                                            fetchData={fetchData}
                                            classNameLink={classes.widthBtn}
                                            className={classes.deleteIcon}
                                        />
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