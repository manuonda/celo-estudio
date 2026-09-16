"use client"

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { WagmiProvider } from 'wagmi'
import { celo, celoSepolia } from 'wagmi/chains'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { http } from 'wagmi'

// Create config with proper SSR handling
let config: any = null

function getWagmiConfig() {
  if (!config) {
    config = getDefaultConfig({
      appName: '1-basic-app',
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
      chains: [celoSepolia, celo],
      transports: {
        [celoSepolia.id]: http("https://forno.celo-sepolia.celo-testnet.org"),
        [celo.id]: http(),
      },
      wallets: [
        {
          groupName: 'Suggested',
          wallets: [injectedWallet, metaMaskWallet, walletConnectWallet],
        },
      ],
      ssr: true,
    })
  }
  return config
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
})

function WalletProviderInner({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={getWagmiConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider initialChain={celoSepolia}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return <WalletProviderInner>{children}</WalletProviderInner>
}
