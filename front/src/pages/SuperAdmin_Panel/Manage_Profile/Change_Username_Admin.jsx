import React, { useState, useEffect, useContext } from "react"
import { useHistory } from 'react-router'
import API from "../../../API"
import SessionContext from '../../../components/session/SessionContext'

import { toast } from "react-toastify"

import {
    Container,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Grid,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton,
    InputAdornment,
    makeStyles
} from '@material-ui/core'

import {
    Visibility,
    VisibilityOff,
    Person
} from '@material-ui/icons'

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
        marginBottom: 8
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
    container: {
        width: "80%",
        backgroundColor: "white",
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
    }
}));

const bcrypt = require("bcryptjs");

export default function Change_Username_Admin() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        id: id,
        username: "",
        lastUsername: "",
        conPass: "",
        password: "",
        show: false
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

    function handleShow() {
        state.show ?
            setState({ show: false }) :
            setState({ show: true });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let reqBody = { username: state.username }
            let isMatch = await bcrypt.compare(state.conPass, state.password);

            await API.get(`username`)
                .then(async res => {
                    const usernames = res.data.result;
                    const isUser = usernames.filter(r => r.username !== state.lastUsername)
                        .find(r => r.username === state.username);

                    if (isUser) {
                        toast.error("Username alredy token");
                    } else {
                        if (isMatch) {
                            await API.put(`admin/${id}`, reqBody, {
                                headers: {
                                    id: id,
                                    token: token,
                                    isAdmin: isAdmin
                                }
                            })
                                .then(
                                    setState({
                                        username: "",
                                        lastUsername: "",
                                        conPass: "",
                                        password: ""
                                    })
                                )
                                .then(toast.success("Update Username Successfuly"))
                                .then(history.push({ pathname: '/admin/profile' }));
                        }
                        else {
                            setState({ conPass: "" });
                            toast.error("Password Incorect");
                        }
                    }
                });
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    useEffect(() => {
        async function fetchData() {
            try {
                await API.get(`admin/${id}`, {
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
                            setState({
                                id: result.id,
                                username: result.username,
                                lastUsername: result.username,
                                password: result.password
                            });
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [])

    return (
        <Container component="main" maxWidth="xs" className={classes.container}>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <Person />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Change Username
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>

                    <Grid item xs={12} >
                        <TextField
                            fullWidth
                            required
                            variant="outlined"
                            label="New Username"
                            name="username"
                            value={state.username}
                            onChange={handleChange}
                            className={classes.root}
                        />
                    </Grid>

                    <FormControl variant="outlined" fullWidth className={classes.root}>
                        <InputLabel htmlFor="pass">Your Password</InputLabel>
                        <OutlinedInput
                            required
                            id="pass"
                            type={state.show ? 'text' : 'password'}
                            name="conPass"
                            value={state.conPass}
                            onChange={handleChange}

                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        type="button"
                                        onClick={handleShow}
                                    >
                                        {state.show ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={110}
                        />
                    </FormControl>

                    <div className={classes.flexDiv}>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Update
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: "/admin/profile" })}
                        >
                            Cancel
                        </Button>

                    </div>
                </form>
            </div>
        </Container>
    )
}