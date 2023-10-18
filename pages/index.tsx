import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home1.module.css";
const Home: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* Add ConnectWallet Button here */}
      <div className={styles.connectWalletButton}>
        <ConnectWallet />
      </div>

      {/* Top Section */}
      <h1 className={styles.h1}>Gods Of Gaming - F3 Dominion Token Generator dApp</h1>
      <div className={styles.nftBoxGrid}>
        <div
          className={styles.optionSelectBox}
          role="button"
          onClick={() => router.push("/stake")}
        >
          {/* Staking an NFT */}
          <Image
            src="/icons/token.webp"
            alt="token"
            width={64}
            height={64}
            loading="lazy" // This line is not strictly necessary for Next.js
          />

          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            Use the staking dApp to yield <b>F3 Tokens</b> from staking your
            NFTs, and earn purchase items from the <b>Game Marketplace.</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
