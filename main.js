Moralis.initialize("UkAR38SqWww25gkgwKdW2AC1nFG08kUWwzOQwE5C")
Moralis.serverURL="https://vgyy4b11hszk.bigmoralis.com:2053/server";

function fetchNFTMetadata(NFTs) {
    for (let i = 0; i <NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // call moralis cloud function -> static jason file
        fetch ("https://vgyy4b11hszk.bigmoralis.com:2053/server/functions/getNFT?_ApplicationId=UkAR38SqWww25gkgwKdW2AC1nFG08kUWwzOQwE5C&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => console.log(res))    
    }
}



async function initializApp() {
    let currentUser = Moralis.User.current();
    if(!currentUser){
        currentUser =await Moralis.Web3.authenticate();
    }
    alert("Your signed in and ready to go Bro!")

    const options = { address: "0xc1f5b3fe13906882c7c07142ca09727ec44a2c8a", chain: "rinkeby"};   
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options)
    fetchNFTMetadata(NFTs.result);
}

initializApp();