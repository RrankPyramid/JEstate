import React from "react";
import Snackbar from '@mui/material/Snackbar';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Avatar,
  AppBar,
  Tab,
  Tabs,
  Box,
  Button,
  IconButton,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  Input,
  TextField,
  SnackbarContent
} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import StoreMallDirectorySharpIcon from '@mui/icons-material/StoreMallDirectorySharp';
import DirectionsRunSharpIcon from '@mui/icons-material/DirectionsRunSharp';
import FormatListNumberedSharpIcon from '@mui/icons-material/FormatListNumberedSharp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ShareSharpIcon from '@mui/icons-material/ShareSharp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  root: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, green 30%, #FF8E53 90%)'
        : 'linear-gradient(20deg, green 30%, darkcyan 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: (props) =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
  root2: {
    background: (props) =>
      props.color === 'red'
        ? 'linear-gradient(45deg, green 30%, #FF8E53 90%)'
        : 'linear-gradient(45deg, darkgreen 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: (props) =>
      props.color === 'red'
        ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
        : '0 3px 5px 2px rgba(33, 203, 243, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
    margin: 8,
  },
  boxes:{
    border: "1.5px solid #121212",
    borderRadius: 3,
    height: 300,
    width: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: 5,
    padding:10,
    "&:hover": {
      backgroundColor: "#121212",
      borderColor: "#00D54B",
      boxShadow:
        "0 1px 3px rgba(255,255,255,0.12), 0 1px 3px rgba(255,255,255,0.24)",
      transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
      transition: "transform 0.15s ease-in-out",
    "&:hover": {
      transform: "scale3d(1.05, 1.05, 1)",
    },
    }
  },
  boxText:{
    margin:5, 
    textAlign:"center",
    marginTop: 20
  },
});

const Index = () => {
  const classes = useStyles();
    const [snackOpen, setSnackOpen] = React.useState(false);

    React.useEffect(() =>{
        if(!window.eth && !window.ethereum){
            setSnackOpen(true);
          }
          else{
            setSnackOpen(false);
          }
    },[window.eth, window.ethereum]);

    function MyButton(props) {
      const { color, ...other } = props;
      const classes = useStyles(props);
      return <Button className={classes.root} {...other} />;
    }

    return ( 
<Container maxWidth="md">
    <Snackbar
        open={snackOpen}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <SnackbarContent style={{
          backgroundColor:'#ff2015',
          color:"#f2f2f2",
          width:748.406969696969696969696969696969696969,
          fontSize: 14, 
          }}
          message={<span id="client-snackbar" >In order to proceed to the marketplace and profile pages, you should install Metamask extension to your browser.</span>}
      />
    </Snackbar>
    <Typography variant="h2" align="center" component="h1" gutterbottom="true" style={{paddingTop:"2vw", color:"#00D54B", fontSize: 100}}>
              JEstate
            </Typography>  
            <div style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 30,
              marginRight: "2vw",
              marginLeft: "2vw",
              marginBottom: 40,
            }}>
              <div className={classes.boxes}
                onClick={() => {
                  window.location.href = "/marketplace";
                }}>
                <img 
                  src="https://ipfs.io/ipfs/Qme3Ceyp97hyp97F4CzDi468fP7nn6iviP6Q3iUNTRXtBH" 
                  style={{
                    width: "295px",
                  }}
                  />
              </div>
            </div>


        <Grid style={{marginRight: "3vw", marginLeft: "3vw", marginTop:50}}>
            <Typography variant="h4" component="h1" gutterbottom="true" align ='start' style={{paddingTop:"2vw", color:"#00D54B"}}>
              Welcome to JEState!
            </Typography>
            <div style={{display:"flex", flexDirection: "row" , marginBottom:-20}}>
              <FiberManualRecordIcon style={{fontSize:20,marginTop:21, color:"#00D54B"}}/>
              <Typography variant="body1" component="h1" gutterbottom="true" align ='start' style={{ color:"#f1ffe3", margin:20}}>
                JEState is a blockchain-based property trading platform set within an expansive metaverse. Here, you can buy, sell, and trade unique virtual properties that exist solely in the digital realm.
              </Typography>
            </div>
            <div style={{display:"flex", flexDirection: "row", marginBottom:-20}}>
              <FiberManualRecordIcon style={{fontSize:20,marginTop:21, color:"#00D54B"}}/>
              <Typography variant="body1" component="h1"  gutterbottom="true" align ='start' style={{ color:"#f1ffe3", margin:20}}>
                Each property is <Typography style={{color:"#00D54B", fontWeight:"bold", display: "inline"}}>one-of-a-kind</Typography> and <Typography style={{color:"#00D54B", fontWeight:"bold", display: "inline"}}>100% owned by you</Typography>; it cannot be duplicated, taken away, or destroyed. Your proof of ownership is securely stored on the <Typography style={{color:"#00D54B", fontWeight:"bold", display: "inline"}}>Ethereum blockchain</Typography>. 
              </Typography>
            </div>
            <div style={{display:"flex", flexDirection: "row", marginBottom:-20}}>
              <FiberManualRecordIcon style={{fontSize:20,marginTop:21, color:"#00D54B"}}/>
              <Typography variant="body1" component="h1"    gutterbottom="true" align ='start' style={{color:"#f1ffe3", margin:20}}>
                As a user, you can <Typography style={{color:"#00D54B", fontWeight:"bold", display: "inline"}}>move into a property, buy or bid on available properties, and list your property for sale or auction </Typography>through our user-friendly marketplace.
              </Typography>
            </div>
            <div style={{display:"flex", flexDirection: "row", marginBottom:-20}}>
              <FiberManualRecordIcon style={{fontSize:20,marginTop:21, color:"#00D54B"}}/>
              <Typography variant="body1" component="h1"    gutterbottom="true" align ='start' style={{color:"#f1ffe3", margin:20}}>
                Create your own digital empire by <Typography style={{color:"#00D54B", fontWeight:"bold", display: "inline"}}>acquiring and managing a portfolio </Typography> of distinct virtual properties, while engaging with a thriving community of fellow property enthusiasts.
              </Typography>
            </div>
            <div style={{display:"flex", flexDirection: "row", marginBottom:-20}}>
              <FiberManualRecordIcon style={{fontSize:20,marginTop:21, color:"#00D54B"}}/>
              <Typography variant="body1" component="h1"    gutterbottom="true" align ='start' style={{color:"#f1ffe3", margin:20}}>
                Join JEState and embark on an exciting journey in the world of metaverse property trading!
              </Typography>
            </div>
        </Grid>
    </Container>
    )
}
export default Index;