Moralis.start({serverUrl:"https://vgyy4b11hszk.bigmoralis.com:2053/server",
appId :"UkAR38SqWww25gkgwKdW2AC1nFG08kUWwzOQwE5C"});
// const CONTRACT_ADDRESS = "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0";  
let web3;

async function init(){
    let currentUser = Moralis.User.current();
    if(!currentUser){
        window.location.pathname = "/index.html";
    }
    web3 = await Moralis.Web3.enable();

//uses the search bar as an input, specifically the nftId parameter
    const urlParams = new URLSearchParams(window.location.search);
    const nftId = urlParams.get("nftId");
    //this function sets the token_id_input automatically to the value in the search bar
    document.getElementById("token_id_input").value = nftId;
  
}

async function transfer(){
    let tokenId = parseInt(document.getElementById("token_id_input").value);
    let address = document.getElementById("address_input").value
    let amount = parseInt(document.getElementById("amount_input").value)

    const options = {type: "erc1155",  
                 receiver: address,
                 contract_address: "0xf3b2a150a0f96ac19afd6ad5cbbc376f6d32c5c0",
                 token_id: tokenId,
                 amount: amount}
let result = await Moralis.transfer(options);
console.log(result);
}

document.getElementById("submit_transfer").onclick = transfer;



 init();