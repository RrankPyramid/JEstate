const { assert } = require('chai');

const NFT = artifacts.require("./nftContract");

require('chai')
    .use(require('chai-as-promised'))
    .should()




contract("NFT", ([deployer, buyer, seller]) => {
    let nftContract


    before(async() => {
        nftContract = await NFT.deployed();
        console.log("before called parent");
    
    })

    describe("DEPLOYMENT", async () => {

        it("deploys succesfully", async () => {
        
            const address = await nftContract.address;
            assert.notEqual(address,"");
            assert.notEqual(address,null);
            assert.notEqual(address,undefined);
            assert.notEqual(address,0x0);

        })

        it("deployer is valid", async() =>{
            const address = await nftContract.owner.call();
            assert.equal(address,deployer);
        })
        
    })

    describe("CREATE_PROPERTY", async () => {

        it("deployer try createProperty", async () => {
            const totalSupplyBefore = await nftContract.totalSupply.call();
            const maxSupply = await nftContract.maxSupply.call();
            
            if(totalSupplyBefore >= maxSupply) {
                await nftContract.createProperty("name", "link", "rarity", {from: buyer}).should.be.rejected;
            } else {
                await nftContract.createProperty("name", "link", "rarity", {from: deployer}).should.be.fulfilled;
                const totalSupplyAfter = await nftContract.totalSupply.call();
    
                assert.equal(totalSupplyBefore.toNumber() + 1, totalSupplyAfter);
                const newProperty = await nftContract.nfts.call(totalSupplyAfter.toNumber() - 1);
                assert.equal(newProperty.name, "name");
                assert.equal(newProperty.cid, "link");
                assert.equal(newProperty.rarity, "rarity");
                assert.equal(newProperty.isOnSale, true);
                assert.equal(newProperty.sellPrice, 50);
                assert.equal(newProperty.isBiddable, false);
                assert.equal(newProperty.maxBid, 0);
                assert.equal(newProperty.maxBidder, '0x0000000000000000000000000000000000000000');
                assert.equal(newProperty.isOccupied, false);
                const newPropertyOwner = await nftContract.ownerOf.call(totalSupplyAfter);
                assert.equal(newPropertyOwner, deployer);
            }
        })
    
        it("not deployer cannot createProperty", async () => {
            await nftContract.createProperty("name", "link", "rarity", {from: buyer}).should.be.rejected;
        })
    
        it("deployer cannot createProperty with the same link", async () => {
            await nftContract.createProperty("name", "link", "rarity", {from: deployer}).should.be.rejected;
        })
    })
    

    describe("OWNER FEATURES", async () => {

        let tokenId_1;
        let nftId_1;
        let tokenId_2;
        let nftId_2;

        
        before(async() => {
            await nftContract.createProperty("for owner features","special owner features 1","rarity",{from:deployer});
          
            const totalSupply_1 = await nftContract.totalSupply.call();
            
            nftId_1 = totalSupply_1.toNumber() - 1;
            tokenId_1 = totalSupply_1.toNumber();

            await nftContract.createProperty("for owner features", "special owner features 2","rarity",{from:deployer});
          
            const totalSupply_2 = await nftContract.totalSupply.call();
        
            nftId_2 = totalSupply_2.toNumber() - 1;
            tokenId_2 = totalSupply_2.toNumber();
        })

        // initial state owner has tokenId and it is on sale

        /////////////////////////////////////////////////////////
        //           PUT ON SALE // CANCEL SALE STARTS
        /////////////////////////////////////////////////////////

        

        it("owner cannot putOnSale if it is sale", async () => {
            await nftContract.putOnSale(tokenId_1, 48001, {from: deployer}).should.be.rejected;
            
        });

        it("not owner cannot cancelSale", async () => {
            await nftContract.cancelSale(tokenId_1, {from: buyer}).should.be.rejected;
        });
        
        it("owner can cancelSale", async () => {
            await nftContract.cancelSale(tokenId_1, {from: deployer});

            const nftData = await nftContract.nfts.call(nftId_1);
            assert.equal(nftData.isOnSale, false);
            assert.equal(nftData.sellPrice, 0);
        });
    

        ///////////////////////////////////////////////////////
        //                   OCCUPY PROPERTY STARTS
        //
        //                   State: deployer has item1 and item2
        //                    item 1 and item 2 are on sale
        //                     owner does not occupy and items are not occupied.
        //                     
        ///////////////////////////////////////////////////////

        it("owner can occupy item 1", async () => {
            await nftContract.occupySingleProperty(tokenId_1, {from: deployer,});
            const userData = await nftContract.users.call(deployer);
            assert.equal(userData.property, tokenId_1);
            const newPropertyData = await nftContract.nfts.call(nftId_1);
            assert.equal(newPropertyData.isOccupied, true);
        });

        it("owner cannot occupy another item 2 if it is on sale", async () => {
            await nftContract.occupySingleProperty(tokenId_2, {from: deployer,}).should.be.rejected;
        });

        it("owner can occupy another item 2 if it is not on sale", async () => {
            await nftContract.cancelSale(tokenId_2, {from: deployer});
            await nftContract.occupySingleProperty(tokenId_2, {from: deployer,});
            const userData = await nftContract.users.call(deployer);
            assert.equal(userData.property, tokenId_2);
            const oldPropertyData = await nftContract.nfts.call(nftId_1);
            assert.equal(oldPropertyData.isOccupied, false);
            const newPropertyData = await nftContract.nfts.call(nftId_2);
            assert.equal(newPropertyData.isOccupied, true);
        });

        it("not owner cannot occupy", async () => {
            await nftContract.occupySingleProperty(tokenId_1, {from: buyer}).should.be.rejected;
        });

        it("owner can vacate", async () => {
            await nftContract.vacateProperty({from: deployer});
            const userData = await nftContract.users.call(deployer);
            assert.equal(userData.property, 0);
            const oldPropertyData = await nftContract.nfts.call(nftId_2);
            assert.equal(oldPropertyData.isOccupied, false);
        });

        it("owner cannot vacate not occupied property ", async () => {
            await nftContract.vacateProperty({from: deployer}).should.be.rejected;
        });

        it("someone cannot occupy not existing token", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.occupySingleProperty(totalSupply.toNumber() + 1, {from: deployer}).should.be.rejected;
        });

        ///////////////////////////////////////////////////////
        //                   OCCUPY PROPERTY ENDS
        ///////////////////////////////////////////////////////

        it("owner cannot cancelSale if not on sale", async () => {
            await nftContract.cancelSale(tokenId_1, {from: deployer}).should.be.rejected;
        });
        
        it("not owner cannot putOnSale", async () => {
            await nftContract.putOnSale(tokenId_1, 48001, {from: buyer}).should.be.rejected;
        });
        
        it("someone cannot sell if item does not exist", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.putOnSale(totalSupply.toNumber() + 1, 48001, {from: deployer}).should.be.rejected;
        });
        
        it("owner cannot putOnSale if occupying the item", async () => {
            await nftContract.occupySingleProperty(tokenId_1, {from: deployer}).should.be.fulfilled;
            await nftContract.putOnSale(tokenId_1, 48001, {from: deployer}).should.be.rejected;
            await nftContract.vacateProperty({from: deployer});
        });
        
        it("owner can putOnSale while item is not occupied", async () => {
            await nftContract.putOnSale(tokenId_1, 48001, {from: deployer});
            const nftData = await nftContract.nfts.call(nftId_1);
            assert.equal(nftData.isOnSale, true);
            assert.equal(nftData.sellPrice, 48001);
            const approvedAddress = await nftContract.getApproved(tokenId_1);
            assert.equal(approvedAddress, nftContract.address);
        });
        
        //
        //          deployer has item1 and item2, both items are not occupied
        //          item1 and item2 are not occupied
        

        

        //
        //          deploy have item1 and item2 both Items are not work
        //          item1 and item2 are not worn


        /////////////////////////////////////////////////////////
        //           PUT ON SALE // CANCEL SALE ENDS
        /////////////////////////////////////////////////////////
        
        /////////////////////////////////////////////////////////
        //                 BUYS ITEM STARTS
        /////////////////////////////////////////////////////////

        it("owner cannot buy his own item", async() =>{
            await nftContract.buyFromSale(tokenId_1, {from: deployer, value: 48001}).should.be.rejected;
        });

        it("someone cannot buy if item does not exist", async() =>{
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.buyFromSale(totalSupply.toNumber() + 1, {from: deployer, value: 48001}).should.be.rejected;
        });

        it("buyer cannot buy if item not on sale", async() =>{
            //tokenId_2 is not on sale
            await nftContract.buyFromSale(tokenId_2, {from: buyer, value: 48001}).should.be.rejected;
        });

        it("buyer cannot buy if sending value is less then sellPrice", async() =>{
            await nftContract.buyFromSale(tokenId_1, {from: buyer, value: 310}).should.be.rejected;
        });

        it("buyer can buy owner's item", async() =>{
            await nftContract.buyFromSale(tokenId_1, {from: buyer, value: 48001});
         
            const nftData = await nftContract.nfts.call(nftId_1);
            const newOwnerAddress = await nftContract.ownerOf.call(tokenId_1);
            assert.equal(newOwnerAddress, buyer);
            assert.equal(nftData.isOnSale, false);
            assert.equal(nftData.sellPrice, 0);
            assert.equal(nftData.isBiddable, false);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.maxBidder, 0x0);
        });

        /////////////////////////////////////////////////////////
        //                 BUYS ITEM ENDS
        /////////////////////////////////////////////////////////


        /////////////////////////////////////////////////////////
        //                  WITHDRAW MONEY STARTS
        /////////////////////////////////////////////////////////

        it("owner cannot withdrawMoney if withdraw amount is higher then owner has", async () => {
            await nftContract.withdrawMoney(40600000, {from: deployer}).should.be.rejected;
        });

        it("owner cannot withdrawMoney if owner trys to trick us with negative values", async () => {
            await nftContract.withdrawMoney(-2, {from: deployer}).should.be.rejected;
        });

        it("owner can withdrawMoney", async () => {
            const startingUserData = await nftContract.users.call(deployer); 
            await nftContract.withdrawMoney(48001, {from: deployer});
            const endingUserData = await nftContract.users.call(deployer); 
            assert.equal(startingUserData.userBalance.toNumber() - 48001, endingUserData.userBalance.toNumber());
        });
   
        /////////////////////////////////////////////////////////
        //                  WITHDRAW MONEY ENDS
        /////////////////////////////////////////////////////////
        

        // state buyer has item1  deployer has item2
        // no one wears anything
    


        /////////////////////////////////////////////////////////
        //                  AUCTION STARTS
        /////////////////////////////////////////////////////////


        it("owner cannot cancelAuction if not biddable", async () => {
            await nftContract.cancelAuction(tokenId_2, {from: deployer}).should.be.rejected;
        })

        it("someone cannot cancelAuction if item not exists", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.cancelAuction(totalSupply.toNumber() + 1, {from: deployer}).should.be.rejected;
        })

        it("owner cannot putOnAuction if is Occupied", async () => {
            //console.log("aaa");
            //const nftData = await nftContract.nfts.call(tokenId_2);
            //console.log("nftData", nftData.isBiddable);
            await nftContract.occupySingleProperty(tokenId_2, {from: deployer});
            await nftContract.putOnAuction(tokenId_2, {from: deployer}).should.be.rejected;
            await nftContract.vacateProperty({from: deployer});
        })

        it("someone cannot putOnAuction random one", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.putOnAuction(totalSupply.toNumber() + 1, {from: deployer}).should.be.rejected;
        })

        it("not owner cannot putOnAuction", async () => {
            await nftContract.putOnAuction(tokenId_2, {from: buyer}).should.be.rejected;
        })

        it("buyer cannot bid if item is not biddable", async () => {
            await nftContract.bid(tokenId_2, {from: buyer, value: 48001}).should.be.rejected;

        })

        it("owner cannot accept bid if item is not biddable", async () => {
            await nftContract.acceptHighestBid(tokenId_2, {from: deployer}).should.be.rejected;
        })

        it("owner can putOnAuction", async () => {
            await nftContract.putOnAuction(tokenId_2, {from: deployer});
            const nftData = await nftContract.nfts.call(nftId_2);

            assert.equal(nftData.isBiddable, true);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.maxBidder, 0x0);
            assert.equal(nftData.isOccupied, false);

            const approvedAddress = await nftContract.getApproved(tokenId_2);
            assert.equal(approvedAddress, nftContract.address);
        })

        it("buyer cannot bid on a biddable item with cash equals 0 at beggining or any time", async () => {
            await nftContract.bid(tokenId_2, {from: buyer, value: 0}).should.be.rejected;
        })
        
        it("owner cannot putOnAuction if already on auction", async () => {
            await nftContract.putOnAuction(tokenId_2, {from: deployer}).should.be.rejected;
        })

        it("not owner cannot cancelAuction", async () => {
            await nftContract.cancelAuction(tokenId_2, {from: buyer}).should.be.rejected;
        })

        it("owner can cancelAuction if biddable", async () => {
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
            const maxBidder = nftDataBefore.maxBidder;
            const maxBid = nftDataBefore.maxBid;
            const maxBidderDataBefore = await nftContract.users.call(maxBidder);
            const maxBidderBalanceBefore = maxBidderDataBefore.userBalance;
            
            await nftContract.cancelAuction(tokenId_2, {from: deployer});
            
            const maxBidderDataAfter= await nftContract.users.call(maxBidder);
            const maxBidderBalanceAfter = maxBidderDataAfter.userBalance;
    
            const nftData = await nftContract.nfts.call(nftId_2);

            assert.equal(maxBid.toNumber() + maxBidderBalanceBefore.toNumber() ,maxBidderBalanceAfter.toNumber());
            assert.equal(nftData.isBiddable, false);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.maxBidder, 0x0);
            assert.equal(nftData.isOccupied, false);
        })

        //burda bidibblea çevrilmeli AGAIN
        it("owner can putOnAuction again", async () => {
            await nftContract.putOnAuction(tokenId_2, {from: deployer});
    
            const nftData = await nftContract.nfts.call(nftId_2);
            assert.equal(nftData.isBiddable, true);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.maxBidder, 0x0);
            assert.equal(nftData.isOccupied, false);

            const approvedAddress = await nftContract.getApproved(tokenId_2);
            assert.equal(approvedAddress, nftContract.address);
        })

        it("someone cannot bid item not exist ", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.bid(totalSupply.toNumber() + 1, {from: deployer, value: 48001}).should.be.rejected;
        })

        it("owner cannot bid", async () => {
            await nftContract.bid(tokenId_2, {from: deployer, value: 48001}).should.be.rejected;
        })

        it("owner cannot accept bid if maxBid == 0", async () => {
            await nftContract.acceptHighestBid(tokenId_2, {from: deployer}).should.be.rejected;
        })

        it("buyer can bid on a biddable item with cash biggrer than 0 at beggining", async () => {
            await nftContract.bid(tokenId_2, {from: buyer, value: 406});
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
         
            const nftData = await nftContract.nfts.call(nftId_2);
            assert.equal(nftData.isBiddable, true);
            assert.equal(nftData.maxBid, 406);
            assert.equal(nftData.maxBidder, buyer);
            assert.equal(nftData.isOccupied, false);
        })

        it("another buyer cannot bid if bid amount is smaller then max bid", async () => {
            await nftContract.bid(tokenId_2, {from: seller, value: 306}).should.be.rejected;
        })

        it("another buyer (or same buyer) can bid on a biddable item with enough cash (max bid)", async () => {
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
            const maxBidderBefore = nftDataBefore.maxBidder;
            const maxBidBefore = nftDataBefore.maxBid;
            const maxBidderDataBefore = await nftContract.users.call(maxBidderBefore);
            const maxBidderBalanceBefore = maxBidderDataBefore.userBalance;

            await nftContract.bid(tokenId_2, {from: seller, value: 48001});

            const nftDataAfter = await nftContract.nfts.call(nftId_2);
            
            const previousMaxBidderDataAfter = await nftContract.users.call(maxBidderBefore);
            const previousMaxBidderBalanceAfter = previousMaxBidderDataAfter.userBalance;

            assert.equal(maxBidBefore.toNumber() + maxBidderBalanceBefore.toNumber(), previousMaxBidderBalanceAfter.toNumber());
                      
            assert.equal(nftDataBefore.isBiddable, true);
            assert.equal(nftDataBefore.maxBid, 406);
            assert.equal(nftDataBefore.maxBidder, buyer);
            assert.equal(nftDataBefore.isOccupied, false);

            assert.equal(nftDataAfter.isBiddable, true);
            assert.equal(nftDataAfter.maxBid, 48001);
            assert.equal(nftDataAfter.maxBidder, seller);
            assert.equal(nftDataAfter.isOccupied, false);            
        })

        it("not maxBidder cannot withdrawBid", async () => {
            //current maxBidder is seller so trying withdraw with buyer
            await nftContract.withdrawBid(tokenId_2, {from: buyer,}).should.be.rejected;
        })

        it("maxBidder can withdrawBid", async () => {
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
            const maxBidderBefore = nftDataBefore.maxBidder;
            const maxBidBefore = nftDataBefore.maxBid;
            const maxBidderDataBefore = await nftContract.users.call(maxBidderBefore);
            const maxBidderBalanceBefore = maxBidderDataBefore.userBalance;

            await nftContract.withdrawBid(tokenId_2, {from: seller});

            const previousMaxBidderDataAfter = await nftContract.users.call(maxBidderBefore);
            const previousMaxBidderBalanceAfter = previousMaxBidderDataAfter.userBalance;

            const nftData = await nftContract.nfts.call(nftId_2);

            assert.equal(maxBidBefore.toNumber() + maxBidderBalanceBefore.toNumber(), previousMaxBidderBalanceAfter.toNumber());

            assert.equal(nftData.isBiddable, true);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.maxBidder, 0x0);
            assert.equal(nftData.isOccupied, false);
        })

        it("buyer can bid on a biddable item with cash biggrer than 0 at beggining", async () => {
            await nftContract.bid(tokenId_2, {from: buyer, value: 204});
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
         
            const nftData = await nftContract.nfts.call(nftId_2);
            assert.equal(nftData.isBiddable, true);
            assert.equal(nftData.maxBid, 204);
            assert.equal(nftData.maxBidder, buyer);
            assert.equal(nftData.isOccupied, false);
            assert.equal(nftData.isBiddable, true);
            
        })

        it("not owner cannot accept bid", async () => {
            await nftContract.acceptHighestBid(tokenId_2, {from: buyer}).should.be.rejected;
        })

        it("someone cannot accept bid of not existing item", async () => {
            const totalSupply = await nftContract.totalSupply.call();
            await nftContract.acceptHighestBid(totalSupply.toNumber() + 1, {from: deployer}).should.be.rejected;
        })

        it("owner can accept bid maxbid > 0 item is biddable", async () => {

            const ownerBefore = await nftContract.ownerOf.call(tokenId_2);
            const ownerDataBefore = await nftContract.users.call(ownerBefore);

            
            const nftDataBefore = await nftContract.nfts.call(nftId_2);
            const buyer = nftDataBefore.maxBidder;
            const price = nftDataBefore.maxBid;



            await nftContract.acceptHighestBid(tokenId_2, {from: deployer});
            const previous_ownerDataAfter = await nftContract.users.call(ownerBefore);


            // previous owner ın parası arttı mı
            assert.equal(ownerDataBefore.userBalance.toNumber() + price.toNumber(), previous_ownerDataAfter.userBalance.toNumber());


            // item default durumda mı
            
            const nftData = await nftContract.nfts.call(nftId_2);
            assert.equal(nftData.isBiddable, false);
            assert.equal(nftData.isOnSale, false);
            assert.equal(nftData.maxBid, 0);
            assert.equal(nftData.sellPrice, 0);
            assert.equal(nftData.maxBidder, 0x0);
            assert.equal(nftData.isOccupied, false);
            // alıcı sahibi mi
        
            const ownerAfter = await nftContract.ownerOf.call(tokenId_2);
            assert.equal(buyer,ownerAfter);
        })

        
        it("owner can withdrawMoney", async () => {
            const startingUserData = await nftContract.users.call(deployer); 
            await nftContract.withdrawMoney(204, {from: deployer});
            const endingUserData = await nftContract.users.call(deployer); 
            assert.equal(startingUserData.userBalance.toNumber() - 204, endingUserData.userBalance.toNumber());
        })

        /////////////////////////////////////////////////////////
        //                     AUCTION ENDS
        /////////////////////////////////////////////////////////
    })
})


