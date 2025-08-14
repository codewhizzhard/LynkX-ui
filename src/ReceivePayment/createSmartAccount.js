
import { createPublicClient, http, getContract } from "viem";
import { arbitrumSepolia, sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {
  createBundlerClient,
  toSimple7702SmartAccount,
} from "viem/account-abstraction";
import { useWalletClient } from "wagmi";


const { data: walletClient } = useWalletClient(); // MetaMask

const client = createPublicClient({ chain: sepolia, transport: http() });

const chain = sepolia;
const usdcAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

const owner = {
  address: walletClient.account.address,
  signTypedData: walletClient.signTypedData.bind(walletClient), // viem will call this for AA
};
const account = await toSimple7702SmartAccount({ client, owner });
console.log("account:", account);

import { erc20Abi } from "viem";
const usdc = getContract({ client, address: usdcAddress, abi: erc20Abi });
const usdcBalance = await usdc.read.balanceOf([account.address]);
console.log("usdcBalance:", usdcBalance);

if (usdcBalance < 3000000) {
  console.log(
    `Fund ${account.address} with USDC on ${client.chain.name} using https://faucet.circle.com, then run this again.`,
  );
  process.exit();
}