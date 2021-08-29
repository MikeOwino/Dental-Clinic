import React, { useState, useContext } from "react"
import moment from "moment"
import { useHistory } from 'react-router'
import API from "../../../API"
import { toast } from "react-toastify"
import SessionContext from "../../../components/session/SessionContext"

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    makeStyles,
    Container,
} from '@material-ui/core'

import { Person } from "@material-ui/icons"

import Patients from "../../../components/Patients"

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
        color: "white !important"
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
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
    container: {
        backgroundColor: "white",
        paddingBottom: "10px",
        marginBottom: "70px",
        marginTop: "50px",
        borderRadius: "5px"
    },
    FormLabel: {
        textAlign: "center",
        marginTop: 12
    },
    FormControl: {
        display: "flex",
        flexFlow: "row",
        marginLeft: 20,
        '& .radioR2': {
            display: "flex",
            flexFlow: "row",
            marginLeft: 75,
            '& .MuiFormControlLabel-root:nth-child(2)': {
                marginLeft: 25
            }
        },
        marginBottom: 15
    },
}));

export default function Create_Payment() {

    const classes = useStyles();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    let history = useHistory();
    const date = moment().format("YYYY-MM-DDThh:mm:ss");

    const [state, updateState] = useState({
        payment: "",
        date: date,
        patient: ""
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
            let p_id = state.patient.id;

            let dd = moment(state.date).format("YYYY-MM-DD HH:mm");

            let reqBody = {
                payment: state.payment,
                date: dd,
                id_patient: p_id
            };

            console.log(reqBody);

            await API.post(`procedure`, reqBody, {
                headers: {
                    id: id,
                    token: token,
                    isAdmin: isAdmin
                }
            })
                .then(toast.success("Pay Successfuly"))
                .then(history.push({ pathname: `/balance/list` }));
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Add Payment
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>

                    <Grid item xs={12} >
                        <Patients
                            value={state.patient}
                            onChange={(event, newValue) => {
                                setState({ patient: newValue });
                            }}
                            className={classes.root}
                        />
                    </Grid>

                    <Grid item xs={12} >
                        <TextField
                            required
                            fullWidth
                            type="number"
                            variant="outlined"
                            label="Payment"
                            name="payment"
                            value={state.payment}
                            onChange={handleChange}
                            className={classes.root}
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
                            onClick={() => history.push({ pathname: "/balance/list" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </Container>
    )
}