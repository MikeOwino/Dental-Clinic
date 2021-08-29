import React, { useEffect, useState, useContext } from "react"
import { useHistory, useParams } from 'react-router'
import { Link } from "react-router-dom"
import moment from "moment"
import API from "../../../API"
import SessionContext from "../../../components/session/SessionContext"

import Teeth from "../../../components/Teeth"
import Patients from "../../../components/Patients"
import Doctors from "../../../components/Doctors"
import Types from "../../../components/Types"

import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Button,
    CssBaseline,
    TextField,
    Typography,
    makeStyles,
    Container,
    Paper
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'

import AddBoxIcon from '@material-ui/icons/AddBox'
import DeleteIcon from '@material-ui/icons/Delete'

import MomentUtils from '@date-io/moment'

import {
    KeyboardDateTimePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers'

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
        width: 250
    },
    root2: {
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
        width: 400
    },
    root3: {
        width:100,
        padding:5,
        border:"1px solid #BEF4F4",
        borderRadius:"5px",
        '&:hover': {
            border:"2px solid #BEF4F4",
        },
        '&:focus': {
            border:"3px solid #BEF4F4",
        },
    },
    deleteIcon: {
        color: "#ed4f1c",
        '&:hover': {
            color: "#e24414"
        }
    },
    paperFilter: {
        backgroundColor: "#FFFFFF",
        padding: 12,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    addBoxIcon: {
        backgroundColor: "#8BE3D9",
        color: "#FFFFFF",
        padding: 6,
        fontSize: 53,
        borderRadius: "5px",
        '&:hover': {
            backgroundColor: "#BEF4F4"
        },
        '&:active': {
            backgroundColor: "#A1F0EB"
        }
    },
    inputSum: {
        border: "none"
    },
    submit: {
        width: 120,
        marginBottom: 20,
        marginTop: 20
    },
    flexDiv: {
        backgroundColor: "#FFFFFF",
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    }
}));

export default function Edit_Procedure() {

    const classes = useStyles();
    const history = useHistory();
    const { id: id_pro } = useParams();

    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    const [state, updateState] = useState({
        payment: "",
        date: "2000-01-01",
        id_patient: "",
        id_doctor: "",

        works: [],
        total: 0,

        category: "Adult",
        id_teeth: "",
        types: "",
        price: ""
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

    async function removeRow(id) {
        let work = state.works;
        let w = work.filter(r => r.id != id);
        setState({ works: w });

        let total = 0;
        w.map(r => total += r.price);
        setState({ total: total });
    }

    async function handleRow() {
        let work = state.works;
        let id;
        (work.length) ?
            id = work[work.length - 1].id + 1 :
            id = 0;

        try {
            if (state.id_teeth != "" && state.types != "") {

                work.push({
                    id: id,
                    teeth: (state.id_teeth == 1 || state.id_teeth == 2) ? "All Teeth" : state.id_teeth,
                    description: state.types.description,
                    id_teeth: state.id_teeth,
                    id_type: state.types.id,
                    price: state.types.bill
                });

                setState({ works: work });

                setState({
                    category: "Adult",
                    id_teeth: "",
                    types: ""
                });

                let total = 0;
                work.map(w => { if (w.price != "") total += parseInt(w.price) });
                setState({ total: total });

            }
        } catch (e) {
            console.log("ERROR", e);
        }
    }

    async function changePriceWork(id, value) {
        let work = state.works;
        let w = work.find(r => r.id == id);
        w.price = value;
        setState({ works: work });

        let total = 0;
        work.map(w => { if (w.price != "") total += parseInt(w.price) });
        setState({ total: total });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        console.log(state);
        console.log("ddddata", state.patients.find(p => p.id == state.id_patient));
        // try {

        //     let dd = moment(state.date).format("YYYY-MM-DD HH:mm");

        //     let reqBody = {
        //         payment: state.payment,
        //         date: dd,
        //         id_patient: state.id_patient,
        //         id_doctor: state.id_doctor,
        //         balance: state.total
        //     };

        //     await API.put(`procedure/${id_pro}`, reqBody, {
        //         headers: {
        //             id: id,
        //             token: token,
        //             isAdmin: isAdmin
        //         }
        //     })
        //         .then(
        //             API.delete(`PTCALL/${id_pro}`, {
        //                 headers: {
        //                     id: id,
        //                     token: token,
        //                     isAdmin: isAdmin
        //                 }
        //             })
        //         )
        //         .then(
        //             state.works.map(work => {
        //                 let PTCReqBody = {
        //                     id_procedure: id_pro,
        //                     id_type: work.id_type,
        //                     id_teeth: work.id_teeth,
        //                     price: (work.price == "" || !work.price) ? 0 : work.price
        //                 };
        //                 API.post(`PTC`, PTCReqBody, {
        //                     headers: {
        //                         id: id,
        //                         token: token,
        //                         isAdmin: isAdmin
        //                     }
        //                 });
        //             })
        //         )
        //         .then(history.push({ pathname: "/procedure/list" }));
        // } catch (e) {
        //     console.log("ERROR", e);
        // }

    }

    useEffect(() => {
        async function fetchData() {
            try {

                await API.get(`procedure/${id_pro}`, {
                    headers: {
                        id: id,
                        token: token,
                        isAdmin: isAdmin
                    }
                })
                    .then(res => {
                        const result = res.data.result;
                        const success = res.data.success;
                        if (success) {
                            setState({
                                id_patient: result.id_patient,
                                id_doctor: result.id_doctor,
                                payment: result.payment,
                                date: moment(result.date).format("YYYY-MM-DDTHH:mm"),
                                total: result.balance
                            });
                        }
                    });

                await API.get('PTCDP', {
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
                            console.log(data);
                            data = data.filter(r => r.id_procedure == id_pro);
                            setState({ works: data });
                        }
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
                    Edit Procedure
                </Typography>

                <form onSubmit={handleSubmit}>

                    <Paper className={classes.paperFilter}>

                        <Patients
                            value={state.id_patient}
                            onChange={(event, newValue) => {
                                setState({ id_patient: newValue ? newValue.id : "" });
                            }}
                            className={classes.root2}
                        />

                        <MuiPickersUtilsProvider utils={MomentUtils} >
                            <KeyboardDateTimePicker
                                value={state.date}
                                inputVariant="outlined"
                                onChange={(date) => setState({ date: moment(date).format("YYYY/MM/DD hh:mm a") })}
                                label="Date Time"
                                format="YYYY/MM/DD hh:mm a"
                                className={classes.root2}
                            />
                        </MuiPickersUtilsProvider>

                    </Paper>


                    <Paper className={classes.paperFilter}>

                        <TextField
                            type="number"
                            name="payment"
                            placeholder="Payment"
                            value={state.payment}
                            onChange={handleChange}
                            variant="outlined"
                            label="Payment"
                            className={classes.root2}
                        />

                        <Doctors
                            value={state.id_doctor}
                            onChange={(event, newValue) => {
                                setState({ id_doctor: newValue ? newValue.id : "" });
                            }}
                            className={classes.root2}
                        />

                    </Paper>


                    <Paper className={classes.paperFilter}>

                        <Autocomplete
                            variant="outlined"
                            options={["Adult", "Child"]}
                            getOptionLabel={(option) => option}
                            onChange={(event, newValue) => setState({ category: newValue })}
                            renderInput={(params) =>
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Category"
                                    className={classes.root}
                                />
                            }
                        />

                        <Teeth
                            value={state.id_teeth}
                            category={state.category}
                            onChange={(event, newValue) => setState({ id_teeth: newValue ? newValue.id : "" })}
                            className={classes.root}
                        />

                        <Types
                            value={state.id_doctor}
                            onChange={(event, newValue) => setState({ types: newValue ? newValue : "" })}
                            className={classes.root}
                        />

                        <Link onClick={handleRow}>
                            <AddBoxIcon className={classes.addBoxIcon} />
                        </Link>

                    </Paper>


                    <TableContainer component={Paper}>
                        <Table>

                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">#</TableCell>
                                    <TableCell align="center">Tooth</TableCell>
                                    <TableCell align="center">Act</TableCell>
                                    <TableCell align="center">Price</TableCell>
                                    <TableCell>Remove</TableCell>
                                </TableRow>
                            </TableHead>


                            <TableBody>
                                {state.works.map((work, i = 1) =>
                                    <TableRow key={work.id}>

                                        <TableCell align="center">
                                            {i += 1}
                                        </TableCell>

                                        <TableCell align="center">
                                        {(work.id_teeth == 1 || work.id_teeth == 2) ? "All Teeth" : work.id_teeth}
                                        </TableCell>

                                        <TableCell align="center">
                                          {work.description}
                                        </TableCell>

                                        <TableCell align="center">
                                            <input
                                                type="number"
                                                style={{ textAlign: "center" }}
                                                placeholder="Price"
                                                value={work.price}
                                                onChange={e => changePriceWork(work.id, e.target.value)}
                                                className={classes.root3}
                                            />
                                        </TableCell>


                                        <TableCell align="center" className={classes.divRow}>
                                            <Link onClick={() => removeRow(work.id)}>
                                                <DeleteIcon className={classes.deleteIcon} />
                                            </Link>
                                        </TableCell>

                                    </TableRow>
                                )}

                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell>Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell align="center">
                                        <input
                                            readOnly
                                            name="total"
                                            style={{ textAlign: "center" }}
                                            value={state.total}
                                            className={classes.inputSum}
                                            onChange={handleChange}
                                        />
                                    </TableCell>
                                    <TableCell></TableCell>
                                </TableRow>

                            </TableBody>

                        </Table>
                    </TableContainer>

                    <div className={classes.flexDiv}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Save
                        </Button>

                        <Button
                            type="button"
                            variant="contained"
                            className={classes.submit}
                            onClick={() => history.push({ pathname: "/procedure/list" })}
                        >
                            Cancel
                        </Button>
                    </div>

                </form>
            </Container>
        </>
    )
}