import { padHex  } from "viem";

export function addressToBytes32(address) {
  return padHex (address, 32);
}
