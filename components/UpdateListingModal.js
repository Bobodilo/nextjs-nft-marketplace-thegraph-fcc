import { Modal, Input, useNotification } from "web3uikit"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import { ethers } from "ethers"

export default function UpdateListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onclose,
}) {
    const dispatch = useNotification()
    const [priceToUpdateListingWith, setPriceToUpdateListingWith] = useState(0)

    const handleUpdateListingSuccess = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing updated successfully",
            title: "Listing Updated - please refresh",
            position: "topR",
        })
    }

    const { runContractfunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(priceToUpdateListingWith || "0"),
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onclose}
            onCloseButtonPressed={onclose}
            onOk={() => {
                updateListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: () => handleUpdateListingSuccess(),
                })
            }}
        >
            <Input
                label="Update Listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
                onChange={(event) => {
                    setPriceToUpdateListingWith(event.target.value)
                }}
            />
        </Modal>
    )
}
