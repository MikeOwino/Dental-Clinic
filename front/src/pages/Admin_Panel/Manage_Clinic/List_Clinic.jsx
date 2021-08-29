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
    Typography,
    Paper,
    makeStyles
} from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import { AddCircleOutline } from '@material-ui/icons'

import ClinicIcon from "../../../images/Clinic.svg"
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
        width: ' 100%',
        marginTop: '80px'
    },
    Typography: {
        marginTop: '15px',
        color: 'black'
    },
    img: {
        width: '20%',
        margin: 5,
        marginTop: 10,
        alignSelf: 'center'
    },
    AddCircleOutline: {
        width: '50%',
        height: '10%',
    },
    buttonsbar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingBottom: 10
    },

}));

export default function List_Clinic() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [clinics, setClinics] = useState([]);

    async function fetchData() {
        try {
            await API.get('clinic', {
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
                        setClinics(result);
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
                    <Grid item xs={6} md={3} sm={4}>
                        <Paper className={classes.paper} >
                            <Link onClick={() => history.push({ pathname: '/clinic/create' })}>
                                <IconButton className={classes.root}>
                                    <AddCircleOutline
                                        className={classes.AddCircleOutline}
                                    />
                                </IconButton>
                            </Link>
                        </Paper>
                    </Grid>

                    {clinics.map(clinic => (
                        <Grid item xs={6} md={3} sm={4} key={clinic.id}>

                            <Paper key={clinic.id} className={classes.paper} >

                                <img src={ClinicIcon} alt="" className={classes.img} />

                                <Typography
                                    variant="h5"
                                    color="primary"
                                    className={classes.Typography}
                                >
                                    {clinic.name}
                                </Typography>

                                <div className={classes.buttonsbar}>

                                    <Link onClick={() => history.push({ pathname: `/clinic/edit/${clinic.id}` })}>
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    
                                    <ConfirmDelete
                                        path={`clinic/${clinic.id}`}
                                        name="Clinic"
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