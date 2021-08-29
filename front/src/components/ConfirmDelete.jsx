import React, { useContext } from 'react'
import API from '../API'
import { Link } from 'react-router-dom'
import SessionContext from "./session/SessionContext"

import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

import {
    Button,
    Paper,
    Typography,
    makeStyles
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: 20,
        width: "100%",
        backgroundImage: 'linear-gradient(#BEF4F4, #8BE3D9)',
        [theme.breakpoints.down('sm')]: {
            marginLeft: 10,
            marginRight: 10
        }
    },
    submit: {
        width: "40%",
        marginTop: 20,
        color: "#FFFFFF",
        backgroundColor: "#ed4f1c",
        '&:hover': {
            backgroundColor: "#e24414"
        }
    },
    cancel: {
        width: "40%",
        marginTop: 20,
        backgroundColor: "#FFFFFF",
        '&:hover': {
            backgroundColor: "#FFFAFA"
        }
    },
    flexDiv: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around"
    },
    typography: {
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    iconDelete: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "13%",
        height: "13%",
        padding: 5,
        fill: "#ed4f1c",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px"
    }
}));


export default function ConfirmDelete(props) {

    const classes = useStyles();
    let { session: { user: { id, token, isAdmin } } } = useContext(SessionContext);

    async function onDelete() {
        await API.delete(props.path, {
            headers: {
                id: id,
                token: token,
                isAdmin: isAdmin
            }
        })
            .then(props.fetchData)
    }

    async function handleDelete() {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <Paper className={classes.paper} >

                        <DeleteIcon className={classes.iconDelete} />

                        <Typography
                            className={classes.typography}
                        >
                            DELETE {props.name}
                        </Typography>


                        <Typography>
                            Are you sure you want to delete this {props.name}?
                        </Typography>

                        <div className={classes.flexDiv}>

                            <Button
                                type="button"
                                variant="contained"
                                className={classes.cancel}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                variant="contained"
                                className={classes.submit}
                                onClick={() => {
                                    onDelete()
                                    onClose();
                                }}
                            >
                                Delete
                            </Button>

                        </div>
                    </Paper>
                );
            }
        });
    }

    return (
        <Link onClick={handleDelete} className={props.classNameLink} >
            <IconButton>
                <DeleteIcon className={props.className} />
            </IconButton>
        </Link>
    )
}