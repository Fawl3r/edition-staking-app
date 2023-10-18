import {
  ThirdwebNftMedia,
  useContract,
  useContractRead,
  useNFT,
  Web3Button,
} from "@thirdweb-dev/react";
import type { FC } from "react";
import {
  editionDropContractAddress,
  stakingContractAddress,
  locktime,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { BigNumber } from "ethers"; // Import BigNumber from ethers

interface NFTCardProps {
  tokenId: number;
  address: string;
}

const NFTCard: FC<NFTCardProps> = ({ tokenId, address }) => {
  const { contract } = useContract(editionDropContractAddress, "edition-drop");
  const { contract: stakingContract } = useContract(stakingContractAddress);
  const { data: nft } = useNFT(contract, tokenId);
  const { data: getstakeInfoOfToken } = useContractRead(
    stakingContract,
    "getStakeInfoForToken",
    [tokenId, address]
  );

  return (
    <>
      {nft && (
        <div className={styles.nftBox}>
          {nft.metadata && (
            <ThirdwebNftMedia
              metadata={nft.metadata}
              className={styles.nftMedia}
            />
          )}
          <h3>{nft.metadata.name}</h3>
          <Web3Button
            action={(contract) =>
              contract?.call("withdraw", [nft.metadata.id, 1])
            }
            contractAddress={stakingContractAddress}
          >
            Withdraw
          </Web3Button>
          <br />
          <br />
          {getstakeInfoOfToken && (
            <Web3Button
              action={(contract) =>
                contract?.call("claimRewards", [nft.metadata.id])
              }
              contractAddress={stakingContractAddress}
            >
              {getstakeInfoOfToken[1].gt(0) && getstakeInfoOfToken[1].mul(3600).gte(BigNumber.from(locktime)) ? (
                "Claim Rewards"
              ) : (
                `Claim in ${Math.max(0, locktime / 3600 - getstakeInfoOfToken[1].toNumber())} hours`
              )}
            </Web3Button>
          )}
        </div>
      )}
    </>
  );
};

export default NFTCard;
