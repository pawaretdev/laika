import { useMemo, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { RotateCwIcon, SendIcon } from 'lucide-react'
import type { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { useSwitchChain, useWriteContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseContractArgs } from '@/lib/utils'
import type { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'
import { useResponseStore } from '@/store/responses'

export function WriteMethod({
  chainId,
  functionName,
  abi,
  contractAddress,
}: {
  chainId?: number
  functionName: string
  abi: EVMABIMethod
  contractAddress: Address
}) {
  const [args, setArgs] = useState<Array<string>>(new Array(abi.inputs.length).fill(''))

  const { pushResponse } = useResponseStore()

  const { switchChain } = useSwitchChain()

  const { writeContract, isPending } = useWriteContract({})

  const parsedArgs = useMemo(() => {
    return parseContractArgs(args, abi.inputs)
  }, [args, abi.inputs])

  const handleWriteClick = () => {
    const targetChainId = chainId ? chainId : mainnet.id
    console.log('[WriteMethod] Calling', functionName, 'with args:', parsedArgs)
    writeContract(
      {
        abi: [abi],
        address: contractAddress,
        functionName,
        args: parsedArgs,
        chainId: targetChainId,
      },
      {
        onSettled(data, error) {
          if (error) {
            console.error('[WriteMethod] Error:', error)
            return pushResponse({
              type: 'WRITE',
              functionName,
              chainId: targetChainId,
              address: contractAddress,
              args: parsedArgs,
              error,
            })
          }
          console.log('[WriteMethod] Success, txHash:', data)
          return pushResponse({
            type: 'WRITE',
            functionName,
            chainId: targetChainId,
            address: contractAddress,
            args: parsedArgs,
            txHash: data,
          })
        },
      },
    )
  }

  const handleSwitchNetwork = () => {
    if (chainId) {
      switchChain({ chainId })
    }
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="text-muted-foreground font-mono">{functionName}</CardTitle>
      </CardHeader>
      {abi && abi.inputs && abi.inputs.length > 0 && (
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              {abi.inputs.map((field: EVMABIMethodInputsOutputs, idx: number) => {
                const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
                  const newArgs = [...args]
                  newArgs[idx] = event.target.value
                  setArgs(newArgs)
                }
                const placeholder = field.type.endsWith('[]')
                  ? `${field.type} (e.g., ["value1", "value2"] or value1, value2)`
                  : field.type
                return (
                  <div key={`${field.type}-${field.name}-${idx}`} className="flex flex-col space-y-1.5">
                    <Label htmlFor={`writeInput-${idx}`}>{`${field.type} ${field.name}`}</Label>
                    <Input
                      id={`writeInput-${idx}`}
                      placeholder={placeholder}
                      value={args[idx] || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                )
              })}
            </div>
          </form>
        </CardContent>
      )}
      <CardFooter>
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, mounted }) => {
            const ready = mounted
            const connected = ready && account && chain

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <Button size="sm" onClick={openConnectModal}>
                        Connect Wallet
                      </Button>
                    )
                  }

                  if (chain.unsupported) {
                    return (
                      <Button size="sm" onClick={handleSwitchNetwork}>
                        Switch Network
                      </Button>
                    )
                  }

                  return (
                    <Button size="sm" onClick={handleWriteClick}>
                      {isPending ? (
                        <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SendIcon className="mr-2 h-4 w-4" />
                      )}
                      Write
                    </Button>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </CardFooter>
    </Card>
  )
}
