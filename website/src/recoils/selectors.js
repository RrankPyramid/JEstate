import { atom, selector, useRecoilState, useRecoilValue } from "recoil";

import {
  myUsername,
  myAddress,
  allItems,
  isBiddable,
  isOnSale,
  rarityLevel,
} from "./atoms";

import { filterCheck } from "../utils/filterCheck";
import { allFilterCheck } from "../utils/allFilterCheck";

const getMyUsername = selector({
  key: "getMyUsername", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const username = get(myUsername);
    const address = get(myAddress);

    if (address && address !== "" && username.length > 0) {
      return username;
    } else if (address && address !== "") {
      return (
        address.slice(0, 4) +
        "..." +
        address.slice(address.length - 2, address.length)
      );
    } else {
      return null;
    }
  },
});


const getAllItemsFiltered = selector({
  key: "getAllItemsFiltered", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    let tempIsBiddable = get(isBiddable);
    let tempIsOnSale = get(isOnSale);
    let tempRarityLevel = get(rarityLevel);

    console.log("tempIsBiddable", tempIsBiddable);
    console.log("tempIsOnSale", tempIsOnSale);
    console.log("tempRarityLevel", tempRarityLevel);
    const temp = get(allItems);

    return allFilterCheck(temp, tempIsBiddable, tempIsOnSale, tempRarityLevel);
  },
});



const getPropertyList = selector({
  key: "getPropertyList", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const temp = get(allItems);

    return temp;
  },
});

const getOccupiedProperties = selector({
  key: "getOccupiedProperties", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const temp = get(allItems);

    return temp.filter((item) => item.isOccupied);
  },
});

const getFilteredProperties = selector({
  key: "getFilteredProperties", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    let tempIsBiddable = get(isBiddable);
    let tempIsOnSale = get(isOnSale);
    let tempRarityLevel = get(rarityLevel);

    const temp = get(allItems);

    return allFilterCheck(temp, tempIsBiddable, tempIsOnSale, tempRarityLevel);
  },
});


export {
  getMyUsername,
  getAllItemsFiltered,
  getPropertyList,
  getOccupiedProperties,
  getFilteredProperties
};
