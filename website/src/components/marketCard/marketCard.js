import React from "react";
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PanToolSharpIcon from "@mui/icons-material/PanToolSharp";
import LocalOfferSharpIcon from "@mui/icons-material/LocalOfferSharp";
import { Grid, Container, Paper } from "@mui/material";
import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import NftContract from "../../abis/nft.json";
import addresses from "../../constants/contracts";
import { getUsername } from "../../utils/getUsernameFromAddress";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#080808",
    maxWidth: 345,
    borderRadius: 8,
    color: "#f1ffe3",
    maxHeight: 395,
    "&:hover": {
      boxShadow:
        "0 1px 3px rgba(255,255,255,0.12), 0 1px 3px rgba(255,255,255,0.24)",
      transition: "all 0.3s cubic-bezier(.25,.8,.25,1)",
    },
  },
  media: {
    height: 220,
    width: "100%",
    borderRadius: 5,
    transition: "transform 0.15s ease-in-out",
    "&:hover": {
      transform: "scale3d(1.05, 1.05, 1)",
    },
  },
  bidPriceInfoContainer: {
    marginLeft: 15,
  },
  myButton: {
    color: "#00D54B",
    backgroundColor: "#080808",
    height: 23,
    position: "relative",
    top: 7,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 12,
    borderRadius: 5,
    border: "1px solid",
    borderColor: "#00D54B",
    "&:hover": {
      backgroundColor: "#00D54B",
      borderColor: "#00D54B",
      color: "#000",
    },
  },
});


const MyTooltip = withStyles((theme) => ({
  tooltip: {
    // backgroundColor: '#f5f5f9',
    // color: 'rgba(0, 0, 0, 0.87)',
    fontSize: 20,
    // maxWidth: 220,
    // fontSize: theme.typography.pxToRem(12),
    // border: '1px solid #dadde9',
  },
}))(Tooltip);

const MarketCard = ({
  name,
  frequency,
  owner,
  imgUrl,
  price,
  auctionPrice,
  isBiddable,
  isOnSale,
  id,
  isProfile,
}) => {
  const classes = useStyles();
  // var owner = ;

  const [usernameToBeShown, setUsernameToBeShown] = React.useState(
    owner.slice(0, 4) + "..." + owner.slice(owner.length - 2, owner.length)
  );

  React.useEffect(async () => {
    var nft_contract_interface = new window.web3.eth.Contract(
      NftContract.abi,
      addresses.NFT_CONTRACTS_ADDRESS
    );

    getUsername(nft_contract_interface, owner).then((data) => {
      setUsernameToBeShown(data.username);
    });
  }, [window.web3.eth]);

  return (
    <Card className={classes.root} variant="outlined">
      <Grid container>
        <Grid item xs>
          <CardActionArea
            disableRipple
            onClick={() => {
              window.location.href = "/item/" + id;
            }}
          >
            <Grid container>
              <CardMedia
                className={classes.media}
                image={imgUrl}
                title={name}
              />
            </Grid>
            <Grid container direction="column" style={{ marginTop: 15 }}>
              <Grid item style={{ marginLeft: 15, marginBottom: 6 }}>
                <Typography variant="caption">{frequency}</Typography>
                <Typography    gutterbottom="true" variant="h6" component="h1">
                  {name}
                </Typography>
              </Grid>
              <Grid item style={{ alignSelf: "flex-start", marginLeft: 15 }}>
                <div style={{ textAlign: "left" }}>
                  <div>
                    <LocalOfferSharpIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={window.web3.utils.fromWei(price).toString()} arrow>
                      <Typography variant="caption">
                        Price: {isOnSale ? window.web3.utils.fromWei(price.toString()).slice(0,5) + " Ξ" : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
                <div style={{ marginTop: 7, textAlign: "left" }}>
                  <div>
                    <PanToolSharpIcon
                      style={{
                        verticalAlign: "middle",
                        marginRight: 5,
                        fontSize: 20,
                      }}
                    />
                    <MyTooltip title={window.web3.utils.fromWei(auctionPrice).toString()} arrow>
                      <Typography variant="caption">
                        Highest bid: {isBiddable ? window.web3.utils.fromWei(auctionPrice.toString()).slice(0,5) + " Ξ" : "-"}
                      </Typography>
                    </MyTooltip>
                  </div>
                </div>
              </Grid>
            </Grid>
          </CardActionArea>
          <Grid container style={{ marginTop: 13, marginBottom: 5 }}>
            <div className={classes.bidPriceInfoContainer}>
              <AccountCircleIcon
                style={{
                  verticalAlign: "middle",
                  marginRight: 4,
                  fontSize: 24,
                }}
              />
              <Typography    gutterbottom="true" variant="caption">
                Owner:
              </Typography>
              <Button
                size="small"
                className={classes.myButton}
                onClick={() => {
                  isProfile
                    ? (window.location.href = owner)
                    : (window.location.href = "profile/" + owner);
                }}
              >
                {usernameToBeShown}
              </Button>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default MarketCard;
