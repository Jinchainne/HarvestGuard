import { createClient } from 'genlayer-js'
import { testnetBradbury } from 'genlayer-js/chains'

export const CONTRACT = '0x6Fe7B30A7235A9cb7d60087dB3bf01ed18fB3739'
const RPC = 'https://rpc-bradbury.genlayer.com'
const reader = () => createClient({ chain: testnetBradbury, endpoint: RPC })
const writer = async () => {
  const provider = (window as any).ethereum
  if (!provider) throw new Error('Connect MetaMask or another EIP-1193 wallet first.')
  const [account] = await provider.request({ method: 'eth_requestAccounts' })
  return createClient({ chain: testnetBradbury, endpoint: RPC, account, provider })
}
export const lots = () => reader().readContract({ address: CONTRACT as any, functionName: 'list_lot_ids', args: [] })
export const lot = (id: number) => reader().readContract({ address: CONTRACT as any, functionName: 'get_lot', args: [id] })
export async function genlayerWrite(method: string, args: unknown[], value = 0n) {
  const client = await writer()
  return client.writeContract({ address: CONTRACT as any, functionName: method, args: args as any, value })
}
export const write = genlayerWrite
