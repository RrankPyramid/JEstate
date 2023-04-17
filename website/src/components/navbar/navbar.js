import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import StorefrontIcon from "@material-ui/icons/Storefront";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import LabelIcon from "@material-ui/icons/Label";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
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
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
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

        // console.log("methods:", smart_contract_interface.methods);

        smart_contract_interface.methods
          .users(myAddress)
          .call()
          .then((data) => {
            // console.log("dataa", data);
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
                let headImg = "";
                if (data.head != 0) {
                  headImg = await smart_contract_interface
                                  .methods
                                  .nfts(data.head - 1)
                                  .call()
                                  .then((data) => {
                                    return data.cid
                                  })
                }
                setAvatarHead(headImg);
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
                window.location.href = "/avatars";
              }}>
              <SupervisedUserCircleIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                  fontSize: 20,
                }}
              />
              Avatars
      </MenuItem>
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
          {/* <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton> */}
          <Button className={classes.title} variant="h6" noWrap onClick={() => {
                window.location.href = "/";
              }} Button >
            <img style={{height:50, marginTop:10}}src={"https://ipfs.io/ipfs/QmQogyec8HzYYc1rs5d6WBRGq79yPLjYNqgzSVVLxTB4g7"} alt={"NFT Suits"} />
          </Button>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {/* <div style={{ marginTop: 10 }}>{useRecoilValue(getUsername)}</div> */}

            <Button
              color="inherit"
              onClick={() => {
                window.location.href = "/avatars";
              }}
            >
              <SupervisedUserCircleIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                  fontSize: 20,
                }}
              />
              Avatars
            </Button>
            {/* <Button
              color="inherit"
              onClick={() => {
                window.location.href = "/allItems";
              }}
            >
              <LabelIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 5,
                  fontSize: 20,
                }}
              />
              All items
            </Button> */}
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
            {/* {window.ethereum && !window.ethereum.selectedAddress && (
              <>
                <Button
                  onClick={() => {
                    setTriggerEth(!triggerEth);
                  }}
                >
                  Connect
                </Button>
              </>
            )} */}
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
            >
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
