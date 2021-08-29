import React, { useEffect, useState, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import { Link } from 'react-router-dom'
import SessionContext from "../../../components/session/SessionContext"

import {
    IconButton,
    Container,
    Grid,
    CssBaseline,
    Paper,
    makeStyles,
    CardContent,
    Avatar
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import { AddCircleOutline } from '@material-ui/icons'

import ConfirmDelete from "../../../components/ConfirmDelete"

const useStyles = makeStyles((theme) => ({
    root: {
        "&:hover": {
            backgroundColor: "transparent"
        }
    },
    EditIcon: {
        color: theme.palette.primary.main
    },
    DeleteIcon: {
        fill: 'red'
    },
    paper: {
        height: '90%',
        width: ' 80%',
        textAlign: 'center',
        display: 'flex !important',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignContent: 'center',
        paddingTop: 10
    },
    container: {
        marginTop: '80px'
    },
    AddCircleOutline: {
        width: '20%',
        height: '10%',
    },
    buttonsbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10
    },
    avatIcon: {
        color: "White",
        backgroundColor: "#8BE3D9"
    },
}));

export default function List_Doctor() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [doctors, setDoctors] = useState([]);

    async function fetchData() {
        try {
            await API.get('doctor', {
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
                        setDoctors(data);
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
                <Grid container>
                    <Grid item xs={12} md={6} sm={6}>
                        <Paper className={classes.paper} >
                            <Link onClick={() => history.push({ pathname: '/doctor/create' })}>
                                <IconButton className={classes.root}>
                                    <AddCircleOutline
                                        className={classes.AddCircleOutline}
                                    />
                                </IconButton>
                            </Link>
                        </Paper>
                    </Grid>

                    {doctors.map(doctor => (
                        <Grid item xs={12} md={6} sm={6} key={doctor.id}>
                            <Paper key={doctor.id} className={classes.paper} >

                                <CardContent>
                                    <div className={classes.root}>
                                        <Avatar src="/broken-image.jpg" className={classes.avatIcon}>
                                            {doctor.first_name.substring(0, 1)}{doctor.last_name.substring(0, 1)}
                                        </Avatar>
                                    </div>
                                    <h3 className={classes.heading}>{doctor.first_name} {doctor.middle_name} {doctor.last_name}</h3>
                                    <span className={classes.subheader}>Call : {doctor.phone}</span>
                                </CardContent>

                                <div className={classes.buttonsbar}>
                                    <Link
                                        onClick={() => history.push({ pathname: `/doctor/edit/${doctor.id}` })}
                                        className="settings"
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <ConfirmDelete
                                        path={`doctor/${doctor.id}`}
                                        name="Doctor"
                                        fetchData={fetchData}
                                        className={classes.DeleteIcon}
                                    />

                                </div>

                            </Paper>
                        </Grid>
                    ))}

                </Grid>
            </Container>
        </>
    )
}