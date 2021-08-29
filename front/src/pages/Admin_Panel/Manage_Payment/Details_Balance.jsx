import React, { useState, useEffect, useContext } from "react"
import { useHistory, useParams } from 'react-router'
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
    Button
} from '@material-ui/core'

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
    resetSearch: {
        backgroundColor: "#8BE3D9",
        color: "#FFFFFF",
        padding: 6,
        fontSize: 53,
        borderRadius: "5px",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        }
    },
    btnAddPay: {
        height: 50
    }
}));

export default function Details_Balance() {

    const classes = useStyles();
    const history = useHistory();
    const { id: id_bal } = useParams();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        isTrue: true,
        patient: '',
        details: [],
        date: null,
    });

    function setState(nextState) {
        updateState(prevState => ({
            ...prevState,
            ...nextState
        }));
    }

    useEffect(() => {

        async function fetchData() {
            try {
                if (state.isTrue) {
                    await API.post(`balance`, { id: id_bal }, {
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
                                setState({ patient: data });
                        });
                    setState({ isTrue: false });
                }

                await API.get(`balance/${id_bal}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        let data = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            if (state.date && state.date != "" && state.date != null)
                                data = data.filter(d => d.date.substring(0, 10) == state.date);
                            setState({ details: data });
                        }
                    });
            } catch (e) {
                console.log("ERROR", e);
            }
        }
        fetchData();
    }, [state.date])

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>

                <Typography variant="h3">
                    Details Balance
                </Typography>

                <Typography variant="h5">
                    {state.patient.first_name} {state.patient.middle_name} {state.patient.last_name} - {state.patient.id}
                </Typography>

                <Paper className={classes.paperFilter}>

                    <Typography variant="h5">
                        Remaining <br /> {state.patient.balance - state.patient.payment}
                    </Typography>

                    <MuiPickersUtilsProvider utils={MomentUtils} >
                        <KeyboardDatePicker
                            focused={state.date != null}
                            label="Date"
                            variant="outlined"
                            inputVariant="outlined"
                            format="YYYY/MM/DD"
                            value={state.date}
                            onChange={(date) => setState({ date: moment(date).format("YYYY-MM-DD") })}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            className={classes.root}
                        />
                    </MuiPickersUtilsProvider>

                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        className={classes.btnAddPay}
                        onClick={() => history.push({ pathname: `/balance/add/payment/${id_bal}` })}
                    >
                        Add Payment
                    </Button>

                    <Link
                        onClick={() => { setState({ date: null }) }}
                    >
                        <RefreshIcon className={classes.resetSearch} />
                    </Link>

                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Hours</TableCell>
                                <TableCell align="center">Balance</TableCell>
                                <TableCell align="center">Payment</TableCell>
                            </TableRow>
                        </TableHead>


                        <TableBody>
                            {state.details.map(detail =>
                                <TableRow key={detail.id}>

                                    <TableCell>
                                        {moment(detail.date).format("YYYY-MM-DD")}
                                    </TableCell>

                                    <TableCell>
                                        {moment(detail.date).format("h:mm A")}
                                    </TableCell>

                                    <TableCell align="center">
                                        {detail.balance}
                                    </TableCell>

                                    <TableCell align="center">
                                        {detail.payment}
                                    </TableCell>

                                </TableRow>
                            )}

                            {(state.date && state.date != "") ?
                                null :
                                <TableRow style={{ 'border-top': "1px solid blue" }}>
                                    <TableCell>
                                        Totale
                                    </TableCell>

                                    <TableCell> </TableCell>

                                    <TableCell align="center">
                                        {state.patient.balance}
                                    </TableCell>

                                    <TableCell align="center">
                                        {state.patient.payment}
                                    </TableCell>
                                </TableRow>
                            }

                        </TableBody>

                    </Table>
                </TableContainer>
            </Container>
        </>
    )
}