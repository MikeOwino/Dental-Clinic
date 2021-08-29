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

import ActIcon from "../../../images/Act.svg"
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
        width: ' 70%',
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
    Typography: {
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

export default function List_Type() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [types, setTypes] = useState([]);

    async function fetchData() {
        try {
            await API.get('type', {
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
                        setTypes(result);
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
                            <Link onClick={() => history.push({ pathname: '/type/create' })}>
                                <IconButton className={classes.root}>
                                    <AddCircleOutline
                                        className={classes.AddCircleOutline}
                                    />
                                </IconButton>
                            </Link>
                        </Paper>
                    </Grid>

                    {types.map(type => (
                        <Grid item xs={6} md={3} sm={4} key={type.id}>

                            <Paper key={type.id} className={classes.paper} >

                                <img src={ActIcon} alt="" className={classes.img} />

                                <Typography
                                    className={classes.Typography}
                                >
                                    {type.description}
                                </Typography>

                                <Typography
                                    className={classes.Typography}
                                >
                                    Price :
                                    {type.bill}
                                </Typography>

                                <div className={classes.buttonsbar}>
                                    <Link
                                        onClick={() => history.push({ pathname: `/type/edit/${type.id}` })}
                                        className="settings"
                                    >
                                        <IconButton>
                                            <EditIcon />
                                        </IconButton>
                                    </Link>
                                    <ConfirmDelete
                                        path={`type/${type.id}`}
                                        name="Act"
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