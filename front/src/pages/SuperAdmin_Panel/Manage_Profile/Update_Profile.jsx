import React from "react"
import { useHistory } from 'react-router'

import {
    Avatar,
    Button,
    Typography,
    Container,
    Grid,
    CssBaseline,
    makeStyles,
    Paper
} from '@material-ui/core'

import { SettingsSharp } from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
    container: {
        width: ' 100%',
        marginTop: '80px'
    },
    Typography: {
        marginBottom: 25,
        marginTop: 25,
    },
    linkButton: {
        margin: 20,
        width: "60%"
    },
    paper: {
        textAlign: "center",
        padding: 30,
        margin: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        textAlign: "center",
        backgroundColor: theme.palette.primary.main,
        color: "white !important"
    }
}));

export default function Update_Profile() {

    const classes = useStyles();
    const history = useHistory();

    return (
        <>
            <CssBaseline />
            <Container className={classes.container}>
                <Grid>

                    <Paper className={classes.paper}>

                        <Avatar className={classes.avatar}>
                            <SettingsSharp />
                        </Avatar>

                        <Typography
                            variant="h3"
                            className={classes.Typography}
                        >
                            Update Profile
                        </Typography>

                        <Button
                            fullWidth
                            type="button"
                            color="primary"
                            variant="contained"
                            className={classes.linkButton}
                            onClick={() => history.push({ pathname: '/admin/profile/information' })}
                        >
                            {/* <AddCircleOutline className={classes.AddCircleOutline} /> */}
                            Change Information
                        </Button>

                        <Button
                            fullWidth
                            type="button"
                            color="primary"
                            variant="contained"
                            className={classes.linkButton}
                            onClick={() => history.push({ pathname: '/admin/profile/username' })}
                        >
                            {/* <AddCircleOutline className={classes.AddCircleOutline} /> */}
                            Change Username
                        </Button>

                        <Button
                            fullWidth
                            type="button"
                            color="primary"
                            variant="contained"
                            className={classes.linkButton}
                            onClick={() => history.push({ pathname: '/admin/profile/password' })}
                        >
                            {/* <AddCircleOutline className={classes.AddCircleOutline} /> */}
                            Change Password
                        </Button>

                    </Paper>

                </Grid>
            </Container>
        </>
    )
}