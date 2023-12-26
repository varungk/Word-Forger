import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '@/components/header'
import { NextUIProvider } from "@nextui-org/react"
import { AuthContextProvider } from '@/config/auth'


export default function App({ Component, pageProps }: AppProps) {
  return(
    <>
        <NextUIProvider>
          <AuthContextProvider>
            <Header/>
            <Component {...pageProps} /> 
          </AuthContextProvider>
        </NextUIProvider> 
    </> 
  )
}
