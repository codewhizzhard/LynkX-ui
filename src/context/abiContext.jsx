import React, { createContext, useContext, useEffect, useState } from "react";

const AbiContext = createContext();

function normalizeChainName(chain) {
  switch (chain?.toLowerCase()) {
    case "ethereumsepolia": return "ethereumSepolia";
    case "avalanchefuji": return "avalancheFuji";
    case "opsepolia": return "opSepolia";
    case "arbitrumsepolia": return "arbitrumSepolia";
    case "basesepolia": return "baseSepolia";
    case "polygonposamoy": return "polygonAmoy";
    case "unichainsepolia": return "unichainSepolia";
    default: return chain;
  }
}

export function AbiProvider({ children }) {


  return (
    <AbiContext.Provider value={{ }}>
      {children}
    </AbiContext.Provider>
  );
}

export function useAbi() {
  return useContext(AbiContext);
}
