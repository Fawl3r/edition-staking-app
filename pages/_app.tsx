import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import React from "react"; // Import React
import Navbar from "../components/Navbar"; // Ensure you have the path to your Navbar component correct
import "../styles/globals.css";

const activeChain = "binance";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      secretKey={process.env.TW_SECRET_KEY}
    >
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Navbar />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Component {...pageProps} />
        </div>
      </div>
    </ThirdwebProvider>
  );
}

export default MyApp;
