import { SafeRpcProvider } from '@/services/safe-wallet-provider/rpc'
import useSafeWalletProvider from '@/services/safe-wallet-provider/useSafeWalletProvider'
import { type CowSwapWidgetParams, TradeType, CowSwapWidget } from '@cowprotocol/widget-react'
import { useState, useEffect } from 'react'
import { Container, Grid } from '@mui/material'
import useChainId from '@/hooks/useChainId'
import { useRef } from 'react';
import { Box } from '@mui/material'
const supportedChains = [1, 100, 11155111]

const isSupportedChainForSwap = (chainId: number) => supportedChains.includes(chainId)
type Params = {
  sell?: {
    asset: string
    amount: string
  }
}
export const CowWidget = ({sell}:Params) => {
  console.log('sell', sell)
  const walletProvider = useSafeWalletProvider()
  const chainId = useChainId()
  const widget = useRef(null)
  const [params, setParams] = useState<CowSwapWidgetParams>({})

  useEffect(() => {
    if (!walletProvider) return

    const provider = new SafeRpcProvider(walletProvider)
    setParams({
      appCode: 'Safe Wallet Swaps', // Name of your app (max 50 characters)
      width: '100%', // Width in pixels (or 100% to use all available space)
      height: '860px',
      provider: provider, // Ethereum EIP-1193 provider. For a quick test, you can pass `window.ethereum`, but consider using something like https://web3modal.com
      chainId: chainId, // 1 (Mainnet), 5 (Goerli), 100 (Gnosis)
      tokenLists: [
        // All default enabled token lists. Also see https://tokenlists.org
        'https://files.cow.fi/tokens/CowSwap.json',
        'https://tokens.coingecko.com/uniswap/all.json',
      ],
      tradeType: TradeType.SWAP, // TradeType.SWAP, TradeType.LIMIT or TradeType.ADVANCED
      sell: sell ? sell : {
        // Sell token. Optionally add amount for sell orders
        asset: '',
        amount: '0',
      },
      // buy: {
      //   // Buy token. Optionally add amount for buy orders
      //   asset: 'COW',
      //   amount: '0',
      // },
      enabledTradeTypes: [
        // TradeType.SWAP, TradeType.LIMIT and/or TradeType.ADVANCED
        TradeType.SWAP,
        TradeType.LIMIT,
        TradeType.ADVANCED,
      ],
      env: 'dev',
      theme: {
        baseTheme: 'dark',
        primary: '#12ff80',
        background: '#1c1c1c',
        paper: '#121312',
        text: '#ffffff',
      },
      interfaceFeeBips: '50', // 0.5% - COMING SOON! Fill the form above if you are interested
    })
  }, [walletProvider])

  // console.log('params', params)
  if (!params.provider) {
    return null
  }

  if (!isSupportedChainForSwap(Number(chainId))) {
    return (
      <Container>
        <Grid container justifyContent="center">
          <div>Swaps are not supported on this chain</div>
        </Grid>
      </Container>
    )
  }

  return (
    <Box sx={{ height: '100%' }}>
        <CowSwapWidget params={params} ref={widget}/>
    </Box>
  )
}