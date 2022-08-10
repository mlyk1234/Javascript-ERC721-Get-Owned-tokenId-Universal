async function etherERC721API(CONTRACT_ADDR: string, ACCOUNT_ADDR: string): Promise<Etherscan721[]> {
    // Custom Token Results -- LEE 2022
    // THIS FUNCTION TAKE tokenId of current owner wallet address
    // Methods used >>> Using etherscan API to get the transfer timestamp
    // Next >>> Using the latest timestamp to check 'to' property that is if it has been transferred
    const endpoint = `https://api-rinkeby.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${CONTRACT_ADDR}&address=${ACCOUNT_ADDR}&page=1&offset=100&sort=asc&apikey=${ETHERSCAN_API}`;

    const { data } = await axios.get(endpoint);

    const tokens_info: Etherscan721[] = [];

    if(data.result.length > 0) {
        
        data.result.forEach((item: Etherscan721, index: number) => {
            let existByTokenId: boolean = false;
            let getLatestTransfer: boolean = false;
            let ownedNFT: boolean = false;
            if(tokens_info.length > 0) {
                tokens_info.forEach((obj: Etherscan721, existIndex: number) => {

                    if(obj.tokenID == item.tokenID) {
                        existByTokenId = true;
                        if(obj.timeStamp < item.timeStamp) {
                            if(obj.to.includes(ACCOUNT_ADDR)){
                                ownedNFT = true;

                                getLatestTransfer = true;
                                console.log('true', getLatestTransfer);
                                Object.assign(tokens_info[existIndex], {
                                    ...item
                                })
                            } else {
                                tokens_info.splice(existIndex, 1);
                            }
                        }
                    }
                })
            }

            if(!existByTokenId && !getLatestTransfer) {
                tokens_info.push({
                    tokenID: item.tokenID,
                    contractAddress: item.contractAddress,
                    tokenName: item.tokenName,
                    tokenSymbol: item.tokenSymbol,
                    timeStamp: item.timeStamp,
                    from: item.from,
                    to: item.to
                });
            }

        });
    }

    return tokens_info;
}
