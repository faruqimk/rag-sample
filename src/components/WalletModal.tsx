import React, { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  connectedWallet: string | null;
  setConnectedWallet: (addr: string | null) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  connectedWallet,
  setConnectedWallet,
}) => {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = (walletName: string) => {
    setIsConnecting(walletName);
    setTimeout(() => {
      // Simulate connection address
      const randomAddr = `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`;
      setConnectedWallet(randomAddr);
      setIsConnecting(null);
      onClose();
    }, 1000);
  };

  const handleDisconnect = () => {
    setConnectedWallet(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#131722] border border-[#2a2e39] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#2a2e39] flex justify-between items-center bg-[#0f131e]">
          <h3 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-[#2962ff]">account_balance_wallet</span>
            <span>Web3 Wallet Connection</span>
          </h3>
          <button onClick={onClose} className="text-[#8d90a2] hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-5 font-mono text-xs space-y-3">
          {connectedWallet ? (
            <div className="bg-[#171b26] p-4 rounded-xl border border-[#20a28a] text-center space-y-3">
              <div className="text-[#66dabf] font-bold text-sm">✓ Wallet Connected</div>
              <div className="text-white font-mono bg-[#0f131e] py-2 px-3 rounded border border-[#2a2e39] break-all">
                {connectedWallet}
              </div>
              <button
                onClick={handleDisconnect}
                className="w-full bg-[#da2237] hover:bg-[#ffb3b0] hover:text-black text-white font-bold py-2 rounded-lg transition-all"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#868993] mb-3">
                Connect your decentralized Web3 wallet to trade live or sync simulated paper trading portfolio:
              </p>

              {[
                { name: 'MetaMask', icon: 'account_balance_wallet', desc: 'Ethereum & EVM Chains' },
                { name: 'Phantom', icon: 'bolt', desc: 'Solana & Bitcoin' },
                { name: 'WalletConnect', icon: 'qr_code_scanner', desc: 'Mobile QR Scan' },
                { name: 'Coinbase Wallet', icon: 'credit_card', desc: 'Passkey / Smart Account' },
              ].map((w) => (
                <button
                  key={w.name}
                  onClick={() => handleConnect(w.name)}
                  disabled={!!isConnecting}
                  className="w-full p-3.5 rounded-xl bg-[#171b26] border border-[#2a2e39] hover:border-[#2962ff] hover:bg-[#262a35] flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg text-[#2962ff] group-hover:scale-110 transition-transform">
                      {w.icon}
                    </span>
                    <div>
                      <div className="font-bold text-white">{w.name}</div>
                      <div className="text-[10px] text-[#868993]">{w.desc}</div>
                    </div>
                  </div>
                  {isConnecting === w.name ? (
                    <span className="text-[10px] text-[#2962ff] font-bold animate-pulse">Connecting...</span>
                  ) : (
                    <span className="material-symbols-outlined text-[#868993] group-hover:text-white">chevron_right</span>
                  )}
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
