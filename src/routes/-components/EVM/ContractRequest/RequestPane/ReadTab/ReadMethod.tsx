import { useEffect, useMemo, useState } from 'react'
import { RotateCwIcon, ScanSearchIcon } from 'lucide-react'
import type { Address } from 'viem'
import { mainnet } from 'viem/chains'
import { useReadContract } from 'wagmi'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { parseContractArgs } from '@/lib/utils'
import type { EVMABIMethod, EVMABIMethodInputsOutputs } from '@/store/collections'
import { useResponseStore } from '@/store/responses'

export function ReadMethod({
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

  const parsedArgs = useMemo(() => {
    return parseContractArgs(args, abi.inputs)
  }, [args, abi.inputs])

  const { data, error, isRefetching, isFetchedAfterMount, refetch } = useReadContract({
    address: contractAddress,
    abi: [abi],
    functionName,
    args: parsedArgs,
    chainId: chainId ? chainId : mainnet.id,
    query: {
      enabled: false,
    },
  })

  const handleReadClick = () => {
    refetch()
  }

  useEffect(() => {
    if (isFetchedAfterMount && !isRefetching) {
      const targetChainId = chainId ? chainId : mainnet.id
      if (error) {
        console.error('[ReadMethod] Error:', error)
        return pushResponse({
          type: 'READ',
          functionName,
          chainId: targetChainId,
          address: contractAddress,
          args: parsedArgs,
          error,
        })
      }
      console.log('[ReadMethod] Success, result:', data)
      return pushResponse({
        type: 'READ',
        functionName,
        chainId: targetChainId,
        address: contractAddress,
        args: parsedArgs,
        result: JSON.stringify(data?.toString()),
      })
    }
  }, [chainId, contractAddress, data, error, functionName, isFetchedAfterMount, isRefetching, parsedArgs, pushResponse])

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
                    <Label htmlFor={`readInput-${idx}`}>{`${field.type} ${field.name}`}</Label>
                    <Input
                      id={`readInput-${idx}`}
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
        <Button size="sm" onClick={handleReadClick}>
          {isRefetching ? (
            <RotateCwIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ScanSearchIcon className="mr-2 h-4 w-4" />
          )}
          Read
        </Button>
      </CardFooter>
    </Card>
  )
}
