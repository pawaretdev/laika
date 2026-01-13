import type { EVMChain } from '@/store/chains'

export const customChains: EVMChain[] = [
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
