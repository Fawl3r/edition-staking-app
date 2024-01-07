import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.css'; // Make sure to create a corresponding CSS module file
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const address = useAddress();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={styles.navContainer}>
      <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.navLeft}>
          <Link href="/" passHref>
            <Image
              src="/logo.png" // Make sure this is the path to your logo
              width={64}
              height={48}
              alt="Home"
              className={styles.homeLink}
            />
          </Link>
        </div>

        <div className={`${styles.navMiddle} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
          <Link href="/" passHref><span className={styles.link}>Home</span></Link>
          <Link href="/stake" passHref><span className={styles.link}>Stake</span></Link>
          {/* External links do not use the Link component */}
          <a
            href="https://f3-nexium-marketplace.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.link} ${styles.externalLink}`} // Add the externalLink class
          >
            Nexium Marketplace
          </a>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" />
          </div>
          {address && (
            <Link href={`/profile/${address}`} passHref>
              <Image
                src="/logo.png" // Make sure this is the path to your user icon
                width={64}
                height={48}
                alt="Profile"
                className={styles.profileImage}
              />
            </Link>
          )}
        </div>

        <div className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          <div className={`${styles.menuIcon} ${isMobileMenuOpen ? styles.open : ''}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
