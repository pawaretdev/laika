import { create } from 'zustand'

export interface Response {
  type: 'WRITE' | 'READ'
  functionName: string
  chainId: number
  address: `0x${string}`
  args?: unknown[]
  result?: string
  txHash?: `0x${string}`
  error?: Error
  timestamp?: number
}

export const useResponseStore = create<{
  responses: Response[]
  pushResponse: (response: Response) => void
  clearResponses: () => void
}>((set) => ({
  responses: [],
  pushResponse: (response) =>
    set((state) => ({
      responses: [...state.responses, { ...response, timestamp: Date.now() }],
    })),
  clearResponses: () => set(() => ({ responses: [] })),
}))
