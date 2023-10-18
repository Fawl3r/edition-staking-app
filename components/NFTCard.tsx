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
          {getstakeInfoOfToken &&
          getstakeInfoOfToken[1].toNumber() != 0 &&
          getstakeInfoOfToken[1].toNumber() * 3600 >= locktime ? (
            <Web3Button
              action={(contract) =>
                contract?.call("claimRewards", [nft.metadata.id])
              }
              contractAddress={stakingContractAddress}
            >
              Claim Rewards
            </Web3Button>
          ) : (
            <Web3Button
              action={() =>
                window.alert(
                  `You can't claim rewards yet, please wait for ${
                    locktime / 3600 - getstakeInfoOfToken[1].toNumber()
                  } hours`
                )
              }
              contractAddress={stakingContractAddress}
            >
              claim in {locktime / 3600 - getstakeInfoOfToken[1].toNumber()}{" "}
              hours
            </Web3Button>
          )}
        </div>
      )}
    </>
  );
};

export default NFTCard;
