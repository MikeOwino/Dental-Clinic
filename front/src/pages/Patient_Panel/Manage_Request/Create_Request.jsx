import React, { useState, useContext } from "react"
import API from "../../../API"
import moment from "moment"
import { useHistory } from "react-router-dom";
import SessionContext from '../../../components/session/SessionContext'

import { toast } from "react-toastify"

import {
    Avatar,
    Button,
    CssBaseline,
    TextareaAutosize,
    Grid,
    Typography,
    makeStyles,
    Container
} from '@material-ui/core'

import { AddCircle } from "@material-ui/icons"


const useStyles = makeStyles((theme) => ({
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
        marginBottom: 15
    },
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.primary.main,
        color: "#FFFFFF !important"
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(4),
    },
    submit: {
        width: 120,
        marginBottom: 20,
        marginTop: 20
    },
    container: {
        backgroundColor: "#FFFFFF",
        paddingBottom: "10px",
        marginBottom: "70px",
        marginTop: "50px",
        borderRadius: "5px"
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
    textAresDex: {
        width: "100% !important",
        padding: 15,
        minHeight: 150
    }
}));

export default function Create_Request() {

    const classes = useStyles();
    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const history = useHistory();
    const date = moment().format("YYYY-MM-DD hh:mm:ss");

    const [state, updateState] = useState({
        description: "",
        date: date,
        status: "Watting",
        id_patient: id
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    function handleChange(e) {
        let { name, value } = e.target;
        setState({ [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let reqBody = state;
            if (state.description.length < 70) {
                await API.post(`request`, reqBody, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(toast.success("Request Successfuly"))
                    .then(history.push({ pathname: "/patient/panel" }));
            } else {
                toast.warning("Note Big!")
            }
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AddCircle />
                </Avatar>
                <Typography component="h1" variant="h5">
                    ADD REQUEST
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>

                    <Grid item xs={12} >
                        <TextareaAutosize
                            maxRows={6}
                            name="description"
                            value={state.description}
                            onChange={handleChange}
                            placeholder="Add Note"
                            className={classes.textAresDex}
                        />
                    </Grid>

                    <div className={classes.flexDiv}>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Add
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: "/patient/panel" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </Container>
    )
}