import React from "react"
import { Link } from "react-router-dom"
import home1 from '../../images/pictures/home1.jpg';
import home2 from '../../images/pictures/home2.jpg';
import home3 from '../../images/pictures/home3.jpg';
import home4 from '../../images/pictures/home4.jpg';
import home5 from '../../images/pictures/home5.jpg';
import home6 from '../../images/pictures/home6.jpg';
import home7 from '../../images/pictures/home7.jpg';
import home8 from '../../images/pictures/home8.jpg';
import home9 from '../../images/pictures/home9.jpg';
import home10 from '../../images/pictures/home10.jpg';
import home11 from '../../images/pictures/home11.jpg';


import {
    Typography,
    CssBaseline,
    makeStyles
} from '@material-ui/core'

import HomeIcon from '@material-ui/icons/Home'

import Logo from '../../images/Logo_L.svg'

const useStyles = makeStyles((theme) => ({
    logo: {
        position: "absolute",
        top: 0,
        left: 10,
        zIndex: "1",
        width: "30%"
    },
    login: {
        position: "absolute",
        top: 20,
        right: 40,
        zIndex: "1",
        display: "flex",
        alignItems: "center",
        color: "#8BE3D9",
        cursor: "pointer",
        borderRadius: "5px",
        textDecoration: "none",
        padding: "1%",
        '&:hover': {
            backgroundColor: "#8BE3D9",
            color: "#FFFFFF"
        },
        [theme.breakpoints.down('xs')]: {
            top: 10,
            right: 20,
            '& .MuiSvgIcon-root': {
                fontSize: 14,
            },
            '& .MuiTypography-body1': {
                fontSize: 14,
            }
        },
    },
    homePic: {
        width: "30%",
        borderRadius: "5px",
        margin: 10,
        border: "2px solid #8BE3D9",
        [theme.breakpoints.down('xs')]: {
            width: "50%",
        },
    },
    picDiv: {
        display: "flex",
        flexFlow: "row",
        padding: 20,
        [theme.breakpoints.up('xs')]: {
            marginRight: 80,
            marginLeft: 80,
            margin: 60,
        },
        borderRadius: "5px",
        borderBottom: "5px solid #FFFFFF",
        borderTop: "5px solid #FFFFFF",
        borderRight: "15px solid #FFFFFF",
        borderLeft: "15px solid #FFFFFF",
        backgroundColor: "#FFFFFF",

        overflowX: "visible",
        overflowY: "hidden",
        '&::-webkit-scrollbar-thumb': {
            background: '#8BE3D9',
            borderRadius: "5px",
            height: "2%",
            width: "20%"
        },
        ' &::-webkit-scrollbar': {
            width: 0,
            background: 'transparent',
        }
    },
    whiteDiv: {
        backgroundColor: "#FFFFFF",
        height: "90px",
        [theme.breakpoints.down('md')]: {
            height: "70px",
        },
        [theme.breakpoints.down('sm')]: {
            height: "30px",
        },
    },
    svgStyleFooter: {
        position: "absolute",
    }
}))

export default function Home() {

    const classes = useStyles();

    return (
        <>
            <CssBaseline />
            <img src={Logo} alt="Dental" className={classes.logo} />

            <Link
                to="/login"
                className={classes.login}
            >
                <HomeIcon />
                <Typography>Login</Typography>
            </Link>

            <div className={classes.whiteDiv} />
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#FFFFFF" fill-opacity="1" d="M0,224L30,234.7C60,245,120,267,180,256C240,245,300,203,360,202.7C420,203,480,245,540,261.3C600,277,660,267,720,245.3C780,224,840,192,900,154.7C960,117,1020,75,1080,96C1140,117,1200,203,1260,218.7C1320,235,1380,181,1410,154.7L1440,128L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"></path>
            </svg>


            <div className={classes.picDiv}>
                <img src={home1} alt="Dental" className={classes.homePic} />
                <img src={home2} alt="Dental" className={classes.homePic} />
                <img src={home3} alt="Dental" className={classes.homePic} />
                <img src={home4} alt="Dental" className={classes.homePic} />
                <img src={home5} alt="Dental" className={classes.homePic} />
                <img src={home6} alt="Dental" className={classes.homePic} />
                <img src={home7} alt="Dental" className={classes.homePic} />
                <img src={home8} alt="Dental" className={classes.homePic} />
                <img src={home9} alt="Dental" className={classes.homePic} />
                <img src={home10} alt="Dental" className={classes.homePic} />
                <img src={home11} alt="Dental" className={classes.homePic} />
            </div>

            <svg className={classes.svgStyleFooter} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
                <path fill="#FFFFFF" fill-opacity="1" d="M0,160L60,149.3C120,139,240,117,360,122.7C480,128,600,160,720,165.3C840,171,960,149,1080,138.7C1200,128,1320,128,1380,128L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
        </>
    )
}