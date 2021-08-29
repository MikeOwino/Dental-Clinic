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
    TextField
} from '@material-ui/core'

import SettingsIcon from '@material-ui/icons/Settings'
import RefreshIcon from '@material-ui/icons/Refresh'

import MomentUtils from '@date-io/moment'

import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers'

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
    },
    settingsIcon: {
        fill: "#ed4f1c",
        "&:hover": {
            fill: "#e24414"
        }
    },
    resetSearch: {
        backgroundColor: "#8BE3D9",
        color: "#FFFFFF",
        padding: 6,
        fontSize: 53,
        borderRadius: "5px",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        },
        '&:active':{
            backgroundColor: "#A1F0EB"
        }
    }
}));

export default function List_Balance() {

    const classes = useStyles();
    const history = useHistory();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        isFetch: true,
        balances: [],
        name: "",
        dateFrom: "2000-01-01",
        dateTo: "2000-01-01",
        max: '',
        min: ''
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

    useEffect(() => {

        async function fetchData() {
            try {
                if (state.isFetch) {
                    await API.get(`maxmindate`, {
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
                                    dateFrom: result.min.substring(0, 10),
                                    dateTo: result.max.substring(0, 10),
                                    min: result.min.substring(0, 10),
                                    max: result.max.substring(0, 10)
                                });
                        });
                    setState({ isFetch: false });
                }

                let reqBody = {
                    dateFrom: moment(state.dateFrom).add(-1, 'days').format("YYYY-MM-DD"),
                    dateTo: moment(state.dateTo).add(1, 'days').format("YYYY-MM-DD")
                }

                await API.post(`balance`, reqBody, {
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
                            if (data) {
                                let result = data.filter(d =>
                                    (d.balance && d.balance != 0 && d.balance != "")
                                    ||
                                    (d.payment && d.payment != 0 && d.payment != "")
                                );
                                if (state.name && state.name != "") {
                                    let length = state.name.length;
                                    result = result.filter(d =>
                                        ((d.first_name.substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                        ||
                                        ((d.last_name.substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                        ||
                                        (((d.first_name + " " + d.last_name).substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                        ||
                                        (((d.first_name + " " + d.middle_name + " " + d.last_name).substring(0, length)).toLowerCase() == (state.name).toLowerCase())
                                        ||
                                        (((d.id).toString()).substring(0, length) == state.name)
                                    );
                                }
                                setState({ balances: result });
                            }
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [JSON.stringify([state.name, state.dateFrom, state.dateTo])])

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>

                <Typography variant="h3">
                    Balances
                </Typography>

                <Paper className={classes.paperFilter}>

                    <TextField
                        variant="outlined"
                        label="Search"
                        name="name"
                        value={state.name}
                        onChange={handleChange}
                        className={classes.root}
                    />

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            label="From"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.dateFrom}
                            onChange={(date) => setState({ dateFrom: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            label="To"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.dateTo}
                            onChange={(date) => setState({ dateTo: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <Link
                        onClick={() => {
                            setState({
                                dateFrom: state.min,
                                dateTo: state.max,
                                name: ""
                            })
                        }}
                    >
                        <RefreshIcon className={classes.resetSearch} />
                    </Link>

                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Patient</TableCell>
                                <TableCell align="center">balance</TableCell>
                                <TableCell align="center">Payment</TableCell>
                                <TableCell align="center">Remaining</TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {state.balances.map(balance =>
                                <TableRow key={balance.id}>

                                    <TableCell>
                                        {balance.id}
                                    </TableCell>

                                    <TableCell>
                                        {balance.first_name} {balance.middle_name} {balance.last_name}
                                    </TableCell>

                                    <TableCell align="center">
                                        {balance.balance}
                                    </TableCell>

                                    <TableCell align="center">
                                        {balance.payment}
                                    </TableCell>

                                    <TableCell align="center">
                                        {balance.balance - balance.payment}
                                    </TableCell>

                                    <TableCell align="center" className={classes.divRow}>
                                        <Link onClick={() => history.push({ pathname: `/balance/details/${balance.id}` })}>
                                            <SettingsIcon className={classes.settingsIcon} />
                                        </Link>
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