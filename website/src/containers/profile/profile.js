import React from "react";
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
  Tooltip,
} from "@mui/material";

import EditSharpIcon from "@mui/icons-material/EditSharp";
import SaveIcon from "@mui/icons-material/Save";

import FaceIcon from "@mui/icons-material/Face";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";

import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';

import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import {
  myUsername,
  myAddress,
  allItems,
  profileDataAtom,
  isBiddable,
  isOnSale,
  rarityLevel,
  isThirdPersonAtom,
  transactionData,
  snackbarTextAtom, 
  snackbarControllerAtom,
} from "../../recoils/atoms";
import {
  getMyUsername,
  getAllItemsFiltered,
  getPropertyList,
  getOccupiedProperties,
  getFilteredProperties
} from "../../recoils/selectors";

import NftContract from "../../abis/nft.json";
import addresses from "../../constants/contracts";

import MarketCardList from "../../components/marketCard/marketCardList";

import { getUsername } from "../../utils/getUsernameFromAddress";

const tabValueState = atom({
  key: "tabValueState", // unique ID (with respect to other atoms/selectors)
  default: 0, // default value (aka initial value)
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 0,
  },
  paperLeft: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,

    // minHeight: 600,
    // minWidth: 300,
  },
  paperRight: {
    // padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    // minHeight: 600,
    // minWidth: 600,
  },
  container: {
    paddingTop: 40,
    minWidth: 600,
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  profileLeft: {
    // width: theme.spacing(25),
    // height: theme.spacing(25),
  },
  numberTextStyle: {
    //color: "black",
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  carouselStyle: {
    width: 300,
  },
  myButton: {
    color: "#000",
    backgroundColor: "#00D54B",
    height: 42,
    position: "relative",
    top: 7,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid",
    borderColor: "#00D54B",
    "&:hover": {
      backgroundColor: "#121212",
      borderColor: "#00D54B",
      color: "#00D54B",
    },
  },
  myMoneyButton: {
    color: "#00D54B",
    backgroundColor: "#121212",
    height: 42,
    position: "relative",
    top: 7,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "1px solid",
    borderColor: "#00D54B",
    "&:hover": {
      backgroundColor: "#00D54B",
      borderColor: "#00D54B",
      color: "#000",
    },
  },
  arrowButton: {
    rec: {
      recArrow: {
        backgroundColor: "#00D54B",
      },
    },
    /* round buttons on hover */
    rec: {
      recArrow: {
        "&hover": {
          backgroundColor: "#00D54B",
        },
      },
    },
  },
}));

async function getRevertReason(txHash, setSnackbarText, setSnackbarController) {
  const tx = await window.web3.eth.getTransaction(txHash)

  var result = await window.web3.eth.call(tx)
  .then((data) => {console.log("DATAAAAA", data)})
  .catch((error) => {
    var index = error.message.indexOf("{");
    return JSON.parse(error.message.substring(index).trim()).originalError.message;
  })
  setSnackbarController(true);
  setSnackbarText(result);
  return result;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const MyTooltip = withStyles((theme) => ({
  tooltip: {
    fontSize: 20,
  },
}))(Tooltip);

const Profile = (props) => {
  const classes = useStyles();
  const [profileAddress, setProfileAdress] = React.useState(
    props.match.params.address
  );

  const [numberSold, setNumberSold] = React.useState(0);
  const [earnedSold, setEarnedSold] = React.useState(0);
  const [buttonTrigger, setButtonTrigger] = React.useState(false);

  const [numberBought, setNumberBought] = React.useState(0);
  const [spentBought, setSpentBought] = React.useState(0);

  const [isLoading, setIsLoading] = React.useState(true);

  const [profileData, setProfileData] = useRecoilState(profileDataAtom);

  const [address, setAddress] = useRecoilState(myAddress);

  const [data, setData] = useRecoilState(allItems);

  const [isThirdPerson, setIsThirdPerson] = useRecoilState(isThirdPersonAtom);

  const [snackbarText, setSnackbarText] = useRecoilState(snackbarTextAtom);
  const [snackbarController, setSnackbarController] = useRecoilState(snackbarControllerAtom);

  const properties = useRecoilValue(getPropertyList);

  if(!window.eth && !window.ethereum){
    window.location.href = window.location.origin;
  }


  React.useEffect(async () => {
    let accounts = await window.ethereum.enable();
    let myAddress = await window.ethereum.selectedAddress;

    setAddress(myAddress);

    // console.log("profileaddress", profileAddress);
    // console.log("myaddress", myAddress);

    setIsThirdPerson(myAddress.toLowerCase() !== profileAddress.toLowerCase());

    var nft_contract_interface = new window.web3.eth.Contract(
      NftContract.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    const username_temp = await getUsername(
      nft_contract_interface,
      profileAddress
    );
    setProfileData(username_temp);
    nft_contract_interface.methods
      .tokensOfOwner(profileAddress)
      .call()
      .then((tokenList) => {

        Promise.all(
          tokenList.map((tokenId) => {
            // console.log("tokenId", tokenId);
            return Promise.resolve(
              nft_contract_interface.methods
                .nfts(tokenId - 1)
                .call()
                .then((currentNftData) => {

                  return nft_contract_interface.methods
                    .ownerOf(tokenId)
                    .call()
                    .then((owner) => {
                      return {
                        ...currentNftData,
                        id: tokenId - 1,
                        tokenId: tokenId,
                        owner: owner,
                      };
                    });
                })
            );
          })
        )
          .then((values) => {
            setData(values);
          })
          .catch((err) => console.log("err", err));
      });
    nft_contract_interface
      .getPastEvents("nftTransaction", {
        fromBlock: 0,
        toBlock: "latest",
      })
      .then((events) => {
        const soldItems = events.filter((item) => {
          return (
            (item.returnValues[1] === "sold" || item.returnValues[1] === "Sold From Auction") &&
            item.returnValues[2].toLowerCase() === profileAddress.toLowerCase()
          );
        });
        setNumberSold(soldItems.length);
        var sum = 0;
        soldItems.forEach((item) => {
          sum += parseInt(item.returnValues[4]);
        });
        setEarnedSold(sum);
        const boughtItems = events.filter((item) => {
          return (
            (item.returnValues[1] === "sold" || item.returnValues[1] === "Sold From Auction") &&
            item.returnValues[3].toLowerCase() === profileAddress.toLowerCase()
          );
        });
        setNumberBought(boughtItems.length);
        sum = 0;
        boughtItems.forEach((item) => {
          sum += parseInt(item.returnValues[4]);
        });
        setSpentBought(sum);
      });
    setIsLoading(false);
    console.log("useeffect 😫😩😫😩");
  }, [window.web3.eth,buttonTrigger]);

  const UpperProfile = () => {
    const classes = useStyles();
    const [firstPersonUsername, setFirstPersonUsername] =
      useRecoilState(myUsername);
    const isThirdPerson = useRecoilValue(isThirdPersonAtom);

    //const [, set] = React.useState();
    const [isSetting, setIsSetting] = React.useState(false);
    const [usernameEditText, setUsernameEditText] = React.useState("");

    const [profileData, setProfileData] = useRecoilState(profileDataAtom);

    return (
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="center"
      >
        <Grid className={classes.profileLeft} item xs={4}>
          <Avatar
            variant="square"
            alt="Remy Sharp"
            src={properties.findIndex((item) => profileData.propertyID === item.tokenId) !==
              -1
                ? "https://ipfs.io/ipfs/"+data[data.findIndex((item) => profileData.propertyID === item.tokenId)].cid
                : 0
              }
            className={classes.large}
          />
        </Grid>

        {/* <Grid item xs={6} direction="row"> */}
        <div style={{ display: "flex", flexDirection: "row" }}>
          {isSetting ? (
            <TextField
              value={usernameEditText}
              onChange={(event) => setUsernameEditText(event.target.value)}
            />
          ) : (
            <Typography variant="h5">
              @{isThirdPerson ? profileData.username : firstPersonUsername}
            </Typography>
          )}

          {isSetting && !isThirdPerson ? (
            <IconButton
              //style={{ marginTop: -15 }}
              color="primary"
              onClick={async (event) => {
                // console.log(event.target.value);
                let myAddress = await window.ethereum.selectedAddress;

                var nft_contract_interface = new window.web3.eth.Contract(
                  NftContract.abi,
                  addresses.NFT_CONTRACTS_ADDRESS
                );
                nft_contract_interface.methods
                  .setUsername(usernameEditText)
                  .send({ from: myAddress })
                  .on("transactionHash", function (hash) {
                    console.log(hash);
                  })
                  .on("confirmation", function (confirmationNumber, receipt) {
                    console.log(confirmationNumber, receipt);
                   // setButtonTrigger(!buttonTrigger);
                  })
                  .on("receipt", async function (receipt) {
                    // receipt example
                    console.log(receipt);
                    getUsername(nft_contract_interface, myAddress).then(
                      (data) => {
                        console.log(data);
                        setFirstPersonUsername(data.username);
                        setIsSetting(false);
                       // setButtonTrigger(!buttonTrigger);
                       window.location.reload();
                      }
                    );
                  })
                  .on("error", async function (error, receipt) {
                    console.log(error, receipt);
                    var error_message = await getRevertReason(receipt.transactionHash, setSnackbarText, setSnackbarController);
                    setIsSetting(false);
                  });
              }}
              size="large">
              <SaveIcon style={{ color: "#00D54B" }} />
            </IconButton>
          ) : !isThirdPerson ? (
            <IconButton
              style={{ marginTop: -9 }}
              color="primary"
              onClick={() => {
                setIsSetting(true);
              }}
              size="large">
              <EditSharpIcon style={{ color: "#00D54B" }} />
            </IconButton>
          ) : (
            <></>
          )}
        </div>
        {/* </Grid> */}
      </Grid>
    );
  };

  const LowerProfile = () => {
    const classes = useStyles();
    const [firstPersonUsername, setFirstPersonUsername] =
      useRecoilState(myUsername);
    const isThirdPerson = useRecoilValue(isThirdPersonAtom);

    const regex = /^([0-9]+(\.[0-9]+)?)$/g;
    const [withdrawMoneyTextFieldError, setwithdrawMoneyTextFieldError] = React.useState(false);

    //const [, set] = React.useState();
    // const [isSetting, setIsSetting] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState(0);
    const [usernameEditText, setUsernameEditText] = React.useState("");

    const [profileData, setProfileData] = useRecoilState(profileDataAtom);

    const onWithdrawPress = async () => {
      // console.log("amount:", withdrawAmount);
      let myAddress = await window.ethereum.selectedAddress;

      var nft_contract_interface = new window.web3.eth.Contract(
        NftContract.abi,
        addresses.NFT_CONTRACTS_ADDRESS
      );
      nft_contract_interface.methods
        .withdrawMoney(window.web3.utils.toWei(withdrawAmount))
        .send({ from: myAddress })
        .on("transactionHash", function (hash) {
          console.log(hash);
         // setButtonTrigger(!buttonTrigger);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log(confirmationNumber, receipt);
         // setButtonTrigger(!buttonTrigger);
        })
        .on("receipt", async function (receipt) {
          // receipt example
          console.log(receipt);
          window.location.reload();
         // setButtonTrigger(!buttonTrigger);
        })
        .on("error", async function (error, receipt) {
          console.log(error, receipt);
          var error_message = await getRevertReason(receipt.transactionHash, setSnackbarText, setSnackbarController);
        });
    };

    return <>
      <Grid
        style={{ marginTop: 30 }}
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid item xs={3}>
          <Typography variant="h5">
            #Items
            {/* {console.log("transactions", transactions)} */}
          </Typography>
          <Typography variant="h5" className={classes.numberTextStyle}>
            {properties.length}
          </Typography>
          <Typography variant="h5">Spent</Typography>
          <MyTooltip title={window.web3.utils.fromWei(spentBought.toString())} arrow>
            <Typography variant="h5" className={classes.numberTextStyle}>
              {window.web3.utils.fromWei(spentBought.toString()).slice(0,4)} Ξ
            </Typography>
          </MyTooltip>
          <Typography variant="h5">Earned</Typography>
          <MyTooltip title={window.web3.utils.fromWei(earnedSold.toString())} arrow>
            <Typography variant="h5" className={classes.numberTextStyle}>
              {window.web3.utils.fromWei(earnedSold.toString()).slice(0,4)} Ξ
            </Typography>
          </MyTooltip>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h5">#Bought</Typography>
          <Typography variant="h5" className={classes.numberTextStyle}>
            {numberBought}
          </Typography>
          <Typography variant="h5">#Sold</Typography>
          <Typography variant="h5" className={classes.numberTextStyle}>
            {numberSold}
          </Typography>
        </Grid>
      </Grid>

      {!isThirdPerson && (
        <>
          <div style={{ display: "flex", flexDirection: "row" }}>{/*  */}
            <MyTooltip title={window.web3.utils.fromWei(profileData.userBalance.toString())} placement="top" arrow>
              <Typography>Balance: {window.web3.utils.fromWei(profileData.userBalance.toString()).slice(0, 4)} Ξ</Typography>
            </MyTooltip>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              error={withdrawMoneyTextFieldError}
              onChange={(event) => {
                // console.log(event.target.value);
                if(event.target.value.toString().match(regex)) {
                  setwithdrawMoneyTextFieldError(false);
                }
                else {
                  setwithdrawMoneyTextFieldError(true);
                }
                setWithdrawAmount(event.target.value);
              }}
              label="Amount"
              id="outlined-margin-none"
              className={classes.textField}
              margin="dense"
              helperText="You need to give a valid amount."
              variant="outlined"
            />
            <Button
              disabled={withdrawMoneyTextFieldError}
              className={classes.myMoneyButton}
              onClick={() => {
                onWithdrawPress();
              }}
            >
              Withdraw
            </Button>
          </div>
        </>
      )}
    </>;
  };

  const ProfileLeftMenu = () => {
    const classes = useStyles();

    return (
      // <Paper variant="outlined" className={classes.paper}>
      <>
        <UpperProfile />
        <LowerProfile />
      </>
      // </Paper>
    );
  };

  const ProfileRightMenu = () => {
    const classes = useStyles();

    return (
      // <Paper variant="outlined" className={classes.paper}>
      <>
        <ProfileTabBar />
        <ProfileTabPanel />
      </>
      // </Paper>
    );
  };

  const ProfileTabBar = () => {
    const StyledTabs = withStyles({
      indicator: {
        top: 5,
        bottom: 5,
        marginLeft: 4,
        height: "80%",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "transparent",
        "& > span": {
          borderRadius: 10,
          width: "100%",
          backgroundColor: "#000",
          opacity: 0.15,
        },
      },
    })((props) => (
      <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />
    ));

    const StyledTab = withStyles((theme) => ({
      root: {
        textTransform: "none",
        color: "#000",
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        "&:focus": {
          opacity: 1,
        },
        alignSelf: "center",
      },
    }))((props) => <Tab disableRipple {...props} />);

    const [value, setValue] = useRecoilState(tabValueState);
    const username = useRecoilValue(myUsername);
    const address = useRecoilValue(myAddress);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    function a11yProps(index) {
      return {
        id: `scrollable-force-tab-${index}`,
        "aria-controls": `scrollable-force-tabpanel-${index}`,
      };
    }

    return (
      <Grid
        style={{ marginTop: 30 }}
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <AppBar
            style={{
              backgroundColor: "#00D54B",
              width: "%40",
              maxWidth: "300",
              borderRadius: 10,
            }}
            position="static"
            color="default"
          >
            <StyledTabs
              value={value}
              onChange={handleChange}
              variant="fullWidth"
              scrollButtons="on"
              indicatorColor="primary"
              textColor="primary"
              aria-label="scrollable force tabs example"
            >
              {/* <StyledTab
                label={
                  <div>
                    <FaceIcon
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />{" "}
                    Avatar
                  </div>
                }
                {...a11yProps(0)}
              /> */}
              <StyledTab
                label={
                  <div>
                    <AccessibilityNewIcon
                      style={{ verticalAlign: "middle", marginRight: 4 }}
                    />{" "}
                    All items
                  </div>
                }
                {...a11yProps(1)}
              />
            </StyledTabs>
          </AppBar>
        </Grid>
      </Grid>
    );
  };
  const ProfileTabPanel = () => {
    const value = useRecoilValue(tabValueState);

    return (
      <>
        {/* <TabPanel value={value} index={0}>
        </TabPanel> */}
        <TabPanel value={value} index={0}>
          <ProfileAllItems />
        </TabPanel>
      </>
    );
  };

  const FilterItems = () => {
    const [marketIsBiddable, setMarketIsBiddable] = useRecoilState(isBiddable);
    const [marketIsOnSale, setMarketIsOnSale] = useRecoilState(isOnSale);
    const [marketRariryLevel, setMarketRariryLevel] =
      useRecoilState(rarityLevel);
    return <>
      <Grid
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid item xs={8}>
          <Grid
            container
            direction="column"
            justifyContent="space-around"
            alignItems="flex-start"
          >
            <Grid item>Filter By:</Grid>
            <Grid item>
              <FormGroup row style={{ marginLeft: -16 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={marketIsBiddable}
                      onChange={() => {
                        setMarketIsBiddable(!marketIsBiddable);
                      }}
                      name="Biddable"
                    />
                  }
                  label="Biddable"
                  labelPlacement="start"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={marketIsOnSale}
                      onChange={() => {
                        setMarketIsOnSale(!marketIsOnSale);
                      }}
                      name="Fixed Price"
                    />
                  }
                  label="Fixed Price"
                  labelPlacement="start"
                />
                <div
                  style={{ marginTop: 10, marginLeft: 20, marginRight: 10 }}
                >
                  Rarity:
                </div>
                <FormControl>
                  {/* <InputLabel htmlFor="age-native-simple">Rarity</InputLabel> */}
                  <Select
                    style={{ width: 100 }}
                    native
                    value={marketRariryLevel}
                    onChange={(event) => {
                      setMarketRariryLevel(event.target.value);
                    }}
                    inputProps={{
                      name: "age",
                      id: "age-native-simple",
                    }}
                  >
                    <option value={"all"}>All</option>
                    <option value={"legendary"}>Legendary</option>
                    <option value={"epic"}>Epic</option>
                    <option value={"rare"}>Rare</option>
                    <option value={"common"}>Common</option>
                  </Select>
                </FormControl>
              </FormGroup>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={2}>

        </Grid>
      </Grid>
    </>;
  };
  const ProfileAllItems = () => {
    const classes = useStyles();

    const allFilteredData = useRecoilValue(getAllItemsFiltered);

    return (
      <Grid
        style={{ marginTop: 30 }}
        container
        direction="row"
        justifyContent="space-around"
        alignItems="flex-start"
      >
        <Grid item xs={12}>
          <FilterItems />
        </Grid>
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <MarketCardList marketCards={allFilteredData} isProfile={true} />
        </Grid>
      </Grid>
    );
  };
  if (isLoading) {
    return (
      <Container className={classes.container} maxWidth="lg">
        Loading
      </Container>
    );
  }
  return (
    <Container className={classes.container} maxWidth="lg">
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Grid
          item
          xs={3}
          style={{ position: "-webkit-sticky", position: "sticky", top: 100 }}
        >
          <ProfileLeftMenu />
        </Grid>
        <Grid item xs={8}>
          <ProfileRightMenu />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile;
