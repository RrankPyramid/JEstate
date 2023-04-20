import React from "react";

import { ImageList, ImageListItem, useMediaQuery } from "@mui/material";
import { useTheme } from '@mui/system';
import makeStyles from '@mui/styles/makeStyles';
import MarketCard from "./marketCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  gridList: {
    padding: "auto",
    margin: "auto",
  },
}));

const MarketCardList = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  const getGridListCols = () => {
    if (isXlUp) {
      return 4;
    }

    if (isLgUp) {
      return 3;
    }

    if (isMdUp) {
      return 2;
    }

    if (isSmUp) {
      return 2;
    }

    return 1;
  };

  return (
    <ImageList
      spacing={15}
      cellHeight={400}
      cols={getGridListCols()}
      className={classes.gridList}
    >
      {props.marketCards.map((cardItem, index) => {
        return (
          <ImageListItem key={index}>
            <MarketCard
              name={cardItem.name}
              frequency={cardItem.rarity}
              owner={cardItem.owner}
              imgUrl={"https://ipfs.io/ipfs/"+cardItem.cid}
              price={cardItem.sellPrice}
              auctionPrice={cardItem.maxBid}
              isBiddable={cardItem.isBiddable}
              isOnSale={cardItem.isOnSale}
              id={cardItem.id}
              isProfile={props.isProfile}
            />
          </ImageListItem>
        );
      })}
    </ImageList>
  );
};

export default MarketCardList;
