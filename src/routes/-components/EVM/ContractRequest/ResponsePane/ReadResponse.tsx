import { AlertCircleIcon, CheckCircleIcon } from 'lucide-react'
import { Inspector } from 'react-inspector'

import { useTheme } from '@/components/ThemeProvider'
import type { Response } from '@/store/responses'

export function ReadResponse({ response }: { response: Response }) {
  const { resolvedTheme } = useTheme()
  const timestamp = response.timestamp ? new Date(response.timestamp).toLocaleTimeString() : ''
  const hasError = !!response.error
  const isSuccess = !hasError && response.result !== undefined

  return (
    <div className="hover:bg-muted/60 rounded border-l-2 border-l-transparent p-2 pl-3 has-[.error]:border-l-red-500 has-[.success]:border-l-blue-500">
      <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
        <span>{timestamp}</span>
        {hasError && (
          <span className="error flex items-center gap-1 text-red-500">
            <AlertCircleIcon className="h-3 w-3" /> Error
          </span>
        )}
        {isSuccess && (
          <span className="success flex items-center gap-1 text-blue-500">
            <CheckCircleIcon className="h-3 w-3" /> Success
          </span>
        )}
      </div>
      <p className="text-primary">
        READ {response.functionName}() at [ChainID={response.chainId}]
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
        <div className="mt-2">
          <span className="text-muted-foreground text-xs">Result:</span>
          <pre className="mt-1 break-all whitespace-pre-wrap">{response.result}</pre>
        </div>
      )}
    </div>
  )
}
