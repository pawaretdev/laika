import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a single (non-array) value based on Solidity type
 */
function parseSingleValue(value: string, solidityType: string): unknown {
  const trimmedValue = value.trim()

  if (trimmedValue === '') {
    return undefined
  }

  // Handle boolean
  if (solidityType === 'bool') {
    return trimmedValue.toLowerCase() === 'true' || trimmedValue === '1'
  }

  // Handle tuple types - parse as JSON
  if (solidityType.startsWith('tuple') || solidityType.startsWith('(')) {
    try {
      return JSON.parse(trimmedValue)
    } catch {
      return trimmedValue
    }
  }

  // Handle bytes types - return as-is (should be hex string)
  if (solidityType.startsWith('bytes')) {
    return trimmedValue
  }

  // Handle uint/int types - return as BigInt for viem compatibility
  if (solidityType.startsWith('uint') || solidityType.startsWith('int')) {
    try {
      // Use BigInt for large number support
      return BigInt(trimmedValue)
    } catch {
      // If BigInt fails, return as string
      return trimmedValue
    }
  }

  // Default: return as string (works for address, string, etc.)
  return trimmedValue
}

/**
 * Parse a string input value to the appropriate type based on Solidity type
 * @param value - The string value from input
 * @param solidityType - The Solidity type (e.g., 'uint256', 'address[]', 'bool')
 * @returns The parsed value in the correct type for viem/wagmi
 */
export function parseContractArg(value: string, solidityType: string): unknown {
  const trimmedValue = value.trim()

  // Handle empty values
  if (trimmedValue === '') {
    if (solidityType.endsWith('[]')) {
      return []
    }
    return undefined
  }

  // Handle array types (e.g., address[], uint256[], bytes32[])
  if (solidityType.endsWith('[]')) {
    const baseType = solidityType.slice(0, -2)

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(trimmedValue)

      // If it's already an array, parse each element
      if (Array.isArray(parsed)) {
        return parsed.map((item) => {
          // If item is already the right type (number, string, etc.), use it directly
          if (typeof item === 'string') {
            return parseSingleValue(item, baseType)
          }
          // For numbers/booleans from JSON, convert appropriately
          return parseSingleValue(String(item), baseType)
        })
      }

      // If JSON.parse succeeded but result is not an array,
      // treat it as a single element array
      return [parseSingleValue(String(parsed), baseType)]
    } catch {
      // JSON parse failed - try comma-separated values
      // But first check if it looks like it might be a single value (no commas)
      if (!trimmedValue.includes(',')) {
        // Single value - wrap in array
        return [parseSingleValue(trimmedValue, baseType)]
      }

      // Multiple comma-separated values
      const items = trimmedValue.split(',').map((item) => item.trim())
      return items.map((item) => parseSingleValue(item, baseType))
    }
  }

  // For non-array types, use parseSingleValue
  return parseSingleValue(trimmedValue, solidityType)
}

/**
 * Parse all contract arguments based on their types
 * @param args - Array of string values from inputs
 * @param inputs - Array of ABI input definitions with type information
 * @returns Array of parsed values
 */
export function parseContractArgs(args: string[], inputs: Array<{ type: string; name: string }>): unknown[] {
  return args.map((arg, idx) => {
    const input = inputs[idx]
    if (!input) return arg
    return parseContractArg(arg, input.type)
  })
}
