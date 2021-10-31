Moralis.start({serverUrl:"https://vgyy4b11hszk.bigmoralis.com:2053/server",
appId :"UkAR38SqWww25gkgwKdW2AC1nFG08kUWwzOQwE5C"});
// const CONTRACT_ADDRESS = "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0";   //cant use as a variable because the option wants a string 
let currentUser;


function fetchNFTMetadata(NFTs){
    let promises = [];
    for (let i = 0; i < NFTs.length; i++) {
        let nft = NFTs[i];
        let id = nft.token_id;
        // call moralis cloud function -> static jason file
        promises.push(fetch("https://vgyy4b11hszk.bigmoralis.com:2053/server/functions/getNFT?_ApplicationId=UkAR38SqWww25gkgwKdW2AC1nFG08kUWwzOQwE5C&nftId=" + id)
        .then(res => res.json())
        .then(res => JSON.parse(res.result))
        .then(res => {nft.metadata = res}) 
        .then(res => {
            const options = { address: "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0", token_id: id, chain: "rinkeby" };
            return Moralis.Web3API.token.getTokenIdOwners(options)
        })
        .then( (res) => {
            nft.owners = [];
            res.result.forEach(element => {
                nft.owners.push(element.owner_of);
            });
            return nft;
        }))
    }
    return Promise.all(promises);
}

function renderInventory(NFTs, ownerData){  
     const parent = document.getElementById("app");
    for (let i = 0; i < NFTs.length; i++) {
        const nft = NFTs[i];
        console.log(nft);
        let htmlString =`
        <div class="card">
  <img class="card-img-top" src="${nft.metadata.image}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">${nft.metadata.name}</h5>
    <p class="card-text">${nft.metadata.description}</p>
    <p class="card-text">Amount: ${nft.amount}</p>
    <p class="card-text">Total supply: ${nft.amount}<\p>
    <p class="card-text">Number of Owners: ${nft.owners.length}<\p>
    <p class="card-text">Your balance: ${ownerData[nft.token_id]}<\p>
    <a href="/mint.html?nftId=${nft.token_id}" class="btn btn-primary">Mint</a>
    <a href="/transfer.html?nftId=${nft.token_id}" class="btn btn-primary">Transfer</a>
  </div>
</div>
`
let col = document.createElement("div");
col.className = " col col-md-4"
col.innerHTML = htmlString;
parent.appendChild(col);
    }   
}

async function getOwnerData(){
    let accounts = currentUser.get("accounts");
    const options = { chain: 'rinkeby', address: accounts[0], token_address: "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0" };
    return Moralis.Web3API.account.getNFTsForContract(options).then((data) => {
        let result = data.result.reduce( (object, currentElement) => {
            object[currentElement.token_id] = currentElement.amount;
            return object;
        }, {})
       console.log(result);
       return result;

    })
}

async function initializeApp(){
     currentUser = Moralis.User.current();
    if(!currentUser){
          currentUser = await Moralis.Web3.authenticate();
    }
    // alert("Your signed in and ready to go Bro!");

    
    const options = { address: "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0", chain: "rinkeby"};   
    let NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    let NFTWithMetadata = await fetchNFTMetadata(NFTs.result);
    let ownerData = await getOwnerData();
    renderInventory(NFTWithMetadata, ownerData);
}



initializeApp();