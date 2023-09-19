import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button,
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import React, { useEffect, useState, useRef } from "react";
import NFTCard from "../components/NFTCard";
import {
  editionDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { FixedSizeList as List } from 'react-window';


const Stake: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    editionDropContractAddress,
    "edition-drop"
  );
  
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(contract, "getStakeInfo", [
    address,
  ]);

  
  const nftGridRef = useRef(null);
  const [page, setPage] = useState(1); // Initialize page number
  
  

  useEffect(() => {
    if (!contract || !address || !ownedNfts) return;
  
    async function loadTotalClaimableRewards() {
      try {
        let totalClaimable = BigNumber.from(0);
  
        for (const nft of ownedNfts) {
          const tokenId = nft.metadata.id;  // Assuming `id` contains the tokenId
          const stakeInfo = await contract?.call("getStakeInfoForToken", [tokenId, address]);
          
          if (stakeInfo && stakeInfo[1]) {
            totalClaimable = totalClaimable.add(stakeInfo[1]);
          }
        }
  
        setClaimableRewards(totalClaimable);
  
      } catch (error) {
        console.error("An error occurred while fetching claimable rewards:", error);
      }
    }
  
    loadTotalClaimableRewards();

     // Set up polling every 5 seconds
     const intervalId = setInterval(loadTotalClaimableRewards, 5000);

     // Cleanup
    return () => {
      clearInterval(intervalId);
    };

  
  }, [contract, address, ownedNfts]);
  

  async function stakeNft(id: string) {
    if (!address) return;

    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
    await contract?.call("stake", [id, 1]);
  }

  if (isLoading) {
    return <div className={styles.container}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.connectWalletButton}>
        <ConnectWallet />
      </div>

      {!address ? (
        <ConnectWallet />
      ) : (
        <>
          <h2>Your Tokens</h2>
          <div className={styles.tokenGrid}>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
              <p className={styles.tokenValue}>
  <b>
    {!claimableRewards
      ? "Loading..."
      : Number(ethers.utils.formatUnits(claimableRewards, 18)).toFixed(2)}
  </b> {tokenBalance?.symbol} Token
</p>
            </div>
            <div className={styles.tokenItem}>
              <h3 className={styles.tokenLabel}>Current Balance</h3>
              <p className={styles.tokenValue}>
  <b>{Number(tokenBalance?.displayValue).toFixed(2)}</b> {tokenBalance?.symbol} Token
              </p>
            </div>
          </div>

          <Web3Button
  action={async (contract) => {
    // Make sure the user owns some NFTs
    if (!ownedNfts || ownedNfts.length === 0) {
      console.log("You don't own any NFTs to claim rewards for.");
      return;
    }

    // Iterate over each owned NFT
    for (const nft of ownedNfts) {
      const tokenId = nft.metadata.id;  // Assuming the ID is stored in metadata
      try {
        // Make the contract call to claim rewards for this particular token
        await contract.call("claimRewards", [tokenId]);
        console.log(`Successfully claimed rewards for token ID: ${tokenId}`);
      } catch (error) {
        console.error(`Failed to claim rewards for token ID ${tokenId}`, error);
      }
    }
  }}
  contractAddress={stakingContractAddress}
>
  Claim Rewards
</Web3Button>




          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>Your Staked NFTs</h2>
          <div>Quantity: {stakedTokens ? stakedTokens[0]?.length : 'Loading...'}</div>
          <div className={styles.nftBoxGrid}>
            {stakedTokens &&
              stakedTokens[0]?.map((stakedToken: BigNumber) => (
                <NFTCard
                  tokenId={stakedToken.toNumber()}
                  key={stakedToken.toString()}
                />
              ))}
          </div>

          <hr className={`${styles.divider} ${styles.spacerTop}`} />
          <h2>Your Unstaked NFTs</h2>
          <div>Quantity: {ownedNfts ? ownedNfts.length : 'Loading...'}</div>
          <div className={styles.nftBoxGrid}>
            {ownedNfts?.map((nft) => (
              <div className={styles.nftBox} key={nft.metadata.id.toString()}>
                <ThirdwebNftMedia
                  metadata={nft.metadata}
                  className={styles.nftMedia}
                />
                <h3>{nft.metadata.name}</h3>
                <Web3Button
                  contractAddress={stakingContractAddress}
                  action={() => stakeNft(nft.metadata.id)}
                >
                  Stake
                </Web3Button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Stake;