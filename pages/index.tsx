import { ConnectWallet } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import Navbar from '../components/Navbar'; // Adjust this import path to wherever your Navbar component is
import styles from "../styles/Home1.module.css"; // Make sure this path is correct for your CSS module
import { motion } from "framer-motion"; // Import motion from framer-motion

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <motion.div // Wrap the entire component with motion.div
      initial={{ opacity: 0, y: 20 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Animation on component mount
      transition={{ duration: 1 }} // Animation duration
      className={styles.container}
    >
      {/* Background video */}
      <video
        className={styles.fullscreenVideo}
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="https://video.wixstatic.com/video/1808ae_b444bd8831f34ea2a1439e1b0ac15556/1080p/mp4/file.mp4"
          type="video/mp4"
        />
      </video>

      <Navbar /> {/* Assuming you have a Navbar component to include */}

      <div className={styles.connectWalletButton}>
        <ConnectWallet />
      </div>

      <motion.h1 // Wrap the heading with motion.h1
        initial={{ opacity: 0, y: -20 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Animation on component mount
        transition={{ duration: 0.5, delay: 0.5 }} // Animation duration and delay
        className={styles.h1}
      >
        <span className={styles.heroTitleGradient}>
          <i>Collect F3 Packs!</i>
        </span>
        <br />
        Your F3 Dominion Journey Starts Here.
      </motion.h1>

      <div className={styles.nftBoxGrid}>
        <div
          className={styles.optionSelectBox}
          role="button"
          tabIndex={0}
          onClick={() => router.push("/stake")}
          onKeyPress={() => router.push("/stake")}
        >
          <Image
            src="/icons/token.webp"
            alt="token"
            width={64}
            height={64}
          />
          <h2 className={styles.selectBoxTitle}>Stake Your NFTs</h2>
          <p className={styles.selectBoxDescription}>
            Use the staking dApp to yield <b>F3 Tokens</b> from staking your
            NFTs, and earn purchase items from the <b>Game Marketplace.</b>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
