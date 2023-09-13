import { ethers } from 'ethers';
import { NETWORKS } from '../constants';
import { ChainId } from '../cctp-sdk/constants';

class WalletProvider {
  provider: ethers.BrowserProvider;

  constructor(provider: ethers.BrowserProvider) {
    this.provider = provider;
  }

  async getSigner(): Promise<ethers.JsonRpcSigner | null> {
    try {
      return await this.provider.getSigner();
    }
    catch (e) {
      return null;
    }
  }

  async switchNetwork(chainId: ChainId): Promise<boolean> {
    const chainIdHex = "0x" + chainId.toString(16);
    
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: chainIdHex }]
      });
    } catch (e: any) {
        if (e.code !== 4902)
          return false;

        try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: chainIdHex,
            ...NETWORKS[chainId]
          }]
        });
      } catch (e) {
        return false;
      }
    }

    return true;
  }
}

const provider = ((): WalletProvider => {
  const provider = new ethers.BrowserProvider(window.ethereum, "any");
  return new WalletProvider(provider);
})();

const useWalletProvider = (): WalletProvider => (
  provider
);

export default useWalletProvider;
