import type { EVMChain } from '@/store/chains'

export const customChains: EVMChain[] = [
  {
    name: 'BNB Smart Chain',
    chain: 'BSC',
    chainId: 56,
    networkId: 56,
    shortName: 'bnb',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpc: [
      { url: 'https://bsc-dataseed1.binance.org', tracking: 'none' },
      { url: 'https://bsc-dataseed2.binance.org', tracking: 'none' },
      { url: 'https://bsc-dataseed3.binance.org', tracking: 'none' },
      { url: 'https://bsc-dataseed4.binance.org', tracking: 'none' },
      { url: 'https://bsc.publicnode.com', tracking: 'none' },
      { url: 'https://bsc-rpc.publicnode.com', tracking: 'none' },
    ],
    faucets: [],
    infoURL: 'https://www.bnbchain.org/',
    slip44: 60,
    explorers: [
      {
        name: 'BscScan',
        url: 'https://bscscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'BNB Smart Chain Testnet',
    chain: 'BSC',
    chainId: 97,
    networkId: 97,
    shortName: 'bnbt',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
    rpc: [
      { url: 'https://data-seed-prebsc-1-s1.binance.org:8545', tracking: 'none' },
      { url: 'https://data-seed-prebsc-2-s1.binance.org:8545', tracking: 'none' },
      { url: 'https://data-seed-prebsc-1-s2.binance.org:8545', tracking: 'none' },
      { url: 'https://data-seed-prebsc-2-s2.binance.org:8545', tracking: 'none' },
      { url: 'https://bsc-testnet.publicnode.com', tracking: 'none' },
      { url: 'https://bsc-testnet-rpc.publicnode.com', tracking: 'none' },
    ],
    faucets: ['https://testnet.bnbchain.org/faucet-smart'],
    infoURL: 'https://www.bnbchain.org/',
    slip44: 60,
    explorers: [
      {
        name: 'BscScan Testnet',
        url: 'https://testnet.bscscan.com',
        standard: 'EIP3091',
      },
    ],
  },
  {
    name: 'Saigon',
    chain: 'RON',
    chainId: 2021,
    networkId: 2021,
    shortName: 'saigon',
    nativeCurrency: {
      name: 'RON',
      symbol: 'RON',
      decimals: 18,
    },
    rpc: [
      { url: 'https://saigon-testnet.roninchain.com/rpc', tracking: 'none' },
      { url: 'https://ronin-saigon.drpc.org', tracking: 'none' },
    ],
    faucets: [],
    infoURL: 'https://docs.roninchain.com/',
    slip44: 60,
    explorers: [
      {
        name: 'Ronin Saigon Explorer',
        url: 'https://saigon-app.roninchain.com',
        standard: 'EIP3091',
      },
    ],
  },
]
