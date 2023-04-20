import React from "react";
import { alpha } from "@mui/material/styles";
import makeStyles from '@mui/styles/makeStyles';
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import LabelIcon from "@mui/icons-material/Label";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Web3 from "web3";
import addresses from "../../constants/contracts";

import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { getMyUsername } from "../../recoils/selectors";
import { myUsername, myAddress } from "../../recoils/atoms";

import Nft from "../../abis/nft.json";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: "sticky",
    top: 0,
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
    margin:0
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
}));

const Navbar = () => {

  if(!window.eth && !window.ethereum){
    window.location.href = window.location.origin;
  }

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [address, setAddress] = useRecoilState(myAddress);
  const [username, setUsername] = useRecoilState(myUsername);
  const [triggerEth, setTriggerEth] = React.useState(false);
  const [avatarHead,setAvatarHead] = React.useState("")

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  window.ethereum.on("accountsChanged", function (accounts) {
    setAddress("");
    setUsername("");
    setTriggerEth(!triggerEth);
  });
  React.useEffect(async () => {
    try {
      window.web3 = new Web3(Web3.givenProvider);
      if (window.ethereum) {
        await window.ethereum.enable(); // pop up
        let myAddress = await window.ethereum.selectedAddress;

        var smart_contract_interface = new window.web3.eth.Contract(
          Nft.abi,
          addresses.NFT_CONTRACTS_ADDRESS
        );
        smart_contract_interface.methods
          .users(myAddress)
          .call()
          .then((data) => {
            setUsername(data.username);
          })
          .catch((error) => {
            console.log(error);
          });
        setAddress(myAddress);

        smart_contract_interface.methods
              .users(myAddress)
              .call()
              .then(async (data) => {
                let propertyImg = "";
                if (data.property != 0) {
                  propertyImg = await smart_contract_interface
                                  .methods
                                  .nfts(data.property - 1)
                                  .call()
                                  .then((data) => {
                                    return data.cid
                                  })
                }
                setAvatarHead(propertyImg);
              })

      }
    } catch (err) {
      console.log(err);
    }
  }, [triggerEth]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={() => {
                window.location.href = "/marketplace";
              }}>
              <StorefrontIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                  fontSize: 20,
                }}
              />
              All items{/*Marketplace */}
      </MenuItem>
      <MenuItem >
      {window.ethereum && !window.ethereum.selectedAddress ? (
              <>
                <Button
                  onClick={() => {
                    setTriggerEth(!triggerEth);
                  }}
                >
                  Connect
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  window.location.href = "/profile/" + address;
                }}
              >
                {
                  avatarHead === "" 
                    ?  <AccountCircle
                          style={{
                            verticalAlign: "middle",
                            marginRight: 10,
                            fontSize: 25,
                          }}
                        />
                    : <img 
                        style={{
                          width: 25, 
                          height: 25, 
                          marginRight: 10, 
                          verticalAlign: "middle"
                        }} 
                        src={"https://ipfs.io/ipfs/"+avatarHead}  
                        alt="fireSpot"
                      />
                }
                {username
                  ? username
                  : address.slice(0, 4) +
                    "..." +
                    address.slice(address.length - 2, address.length)}
                
              </Button>
            )}
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="sticky">
        <Toolbar>
          {}
          <Button className={classes.title} variant="h6" noWrap onClick={() => {
                window.location.href = "/";
              }} Button >
            <img style={{height:60, marginTop:10}}src={"https://ipfs.io/ipfs/QmTPZSY4ZGi9zbost5bEb8H6VLvE5xSHHLF6ZNqywXyMJE"} alt={"JEstate"} />
          </Button>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {}
            {}
            <Button
              color="inherit"
              onClick={() => {
                window.location.href = "/marketplace";
              }}
            >
              <StorefrontIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                  fontSize: 20,
                }}
              />
              All items{/*Marketplace */}
            </Button>
            {}
            {window.ethereum && !window.ethereum.selectedAddress ? (
              <>
                <Button
                  onClick={() => {
                    setTriggerEth(!triggerEth);
                  }}
                >
                  Connect
                </Button>
              </>
            ) : (
              <Button
                color="inherit"
                onClick={() => {
                  window.location.href = "/profile/" + address;
                }}
              >
                
                {username
                  ? username
                  : address.slice(0, 4) +
                    "..." +
                    address.slice(address.length - 2, address.length)}
                {
                  avatarHead === "" 
                    ?  <AccountCircle
                          style={{
                            verticalAlign: "middle",
                            marginLeft: 10,
                            fontSize: 40,
                          }}
                        />
                    : <img 
                        style={{
                          width: 55, 
                          height: 65, 
                          marginLeft: 10, 
                          verticalAlign: "middle"
                        }} 
                        src={"https://ipfs.io/ipfs/"+avatarHead}  
                        alt="fireSpot"
                      />
                }
              </Button>
            )}
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              size="large">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

export default Navbar;
