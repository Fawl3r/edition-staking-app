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
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  editionDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home1.module.css";
import { motion } from "framer-motion"; // Import motion from framer-motion

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

  if (stakedTokens) {
    console.log("staked tokens", stakedTokens[0].toString());
  }

  useEffect(() => {
    if (!contract || !address) return;

    if (stakedTokens) {
      const rewards = stakedTokens[0];
      setClaimableRewards(rewards);
    }
  }, [address, contract, stakedTokens]);

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
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <div className={styles.container}>Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className={styles.container}>
        <hr className={`${styles.divider} ${styles.spacerTop}`} />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={styles.connectWalletButton}
        >
          <ConnectWallet />
        </motion.div>
        {!address ? (
          <ConnectWallet />
        ) : (
          <>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Tokens
            </motion.h2>
            <div className={styles.tokenGrid}>
              <motion.div
                className={styles.tokenItem}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className={styles.tokenLabel}>Claimable Rewards</h3>
                <p className={styles.tokenValue}>
                  <b>{claimableRewards ? claimableRewards.toString() : "Loading..."}</b> F3 Tokens
                </p>
              </motion.div>
              <motion.div
                className={styles.tokenItem}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <h3 className={styles.tokenLabel}>Current Balance</h3>
                <p className={styles.tokenValue}>
                  <b>{Number(tokenBalance?.displayValue).toFixed(2)}</b>{" "}
                  {tokenBalance?.symbol}{" Tokens"}
                </p>
              </motion.div>
            </div>

            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              Your Staked NFTs
            </motion.h2>
            <div className={styles.nftBoxGrid}>
              {stakedTokens &&
                stakedTokens[0]?.map((stakedToken: BigNumber) => (
                  <NFTCard
                    tokenId={stakedToken.toNumber()}
                    key={stakedToken.toString()}
                    address={address}
                  />
                ))}
            </div>

            <hr className={`${styles.divider} ${styles.spacerTop}`} />
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Your Unstaked NFTs
            </motion.h2>
            <div className={styles.nftBoxGrid}>
              {ownedNfts?.map((nft) => (
                <motion.div
                  className={styles.nftBox}
                  key={nft.metadata.id.toString()}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
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
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Stake;
