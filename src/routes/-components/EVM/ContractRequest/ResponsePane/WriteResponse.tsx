import { AlertCircleIcon, CheckCircleIcon, LoaderIcon } from 'lucide-react'
import { Inspector } from 'react-inspector'
import { useWaitForTransactionReceipt } from 'wagmi'

import { useTheme } from '@/components/ThemeProvider'
import type { Response } from '@/store/responses'

export function WriteResponse({ response }: { response: Response }) {
  const { data, isLoading } = useWaitForTransactionReceipt({
    hash: response.txHash,
    query: { enabled: !!response.txHash },
  })
  const { resolvedTheme } = useTheme()

  const timestamp = response.timestamp ? new Date(response.timestamp).toLocaleTimeString() : ''
  const hasError = !!response.error
  const isSuccess = !!response.txHash

  return (
    <div className="hover:bg-muted/60 rounded border-l-2 border-l-transparent p-2 pl-3 has-[.error]:border-l-red-500 has-[.success]:border-l-green-500">
      <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
        <span>{timestamp}</span>
        {hasError && (
          <span className="error flex items-center gap-1 text-red-500">
            <AlertCircleIcon className="h-3 w-3" /> Error
          </span>
        )}
        {isSuccess && (
          <span className="success flex items-center gap-1 text-green-500">
            {isLoading ? <LoaderIcon className="h-3 w-3 animate-spin" /> : <CheckCircleIcon className="h-3 w-3" />}
            {isLoading ? 'Pending' : 'Success'}
          </span>
        )}
      </div>
      <p className="text-primary">
        WRITE {response.functionName}() at [ChainID={response.chainId}]
      </p>
      <p className="text-muted-foreground truncate text-xs">{response.address}</p>
      {response.args && response.args.length > 0 && (
        <div className="mt-1">
          <span className="text-muted-foreground text-xs">Args:</span>
          <Inspector
            table={false}
            data={response.args}
            expandLevel={1}
            theme={resolvedTheme === 'light' ? 'chromeLight' : 'chromeDark'}
          />
        </div>
      )}
      {hasError && (
        <div className="mt-2 rounded bg-red-500/10 p-2">
          <p className="text-xs font-medium text-red-500">Error Message:</p>
          <pre className="mt-1 text-xs break-all whitespace-pre-wrap text-red-400">
            {response.error?.message || 'Unknown error'}
          </pre>
          {response.error?.cause != null && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs text-red-400">Show Details</summary>
              <pre className="mt-1 max-h-32 overflow-auto text-xs break-all whitespace-pre-wrap text-red-400">
                {JSON.stringify(response.error.cause as object, null, 2)}
              </pre>
            </details>
          )}
        </div>
      )}
      {isSuccess && (
        <>
          <p className="mt-1 text-xs">
            <span className="text-muted-foreground">tx:</span>{' '}
            <span className="break-all underline">{response.txHash}</span>
          </p>
          {!isLoading && data && (
            <div className="mt-1">
              <span className="text-muted-foreground text-xs">Receipt:</span>
              <Inspector
                table={false}
                data={data}
                expandLevel={1}
                theme={resolvedTheme === 'light' ? 'chromeLight' : 'chromeDark'}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
