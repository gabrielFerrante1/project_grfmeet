import "../styles/globals.css"
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { Provider } from "react-redux"
import { store } from "../redux/store"
import { ChakraProvider } from "@chakra-ui/react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </Provider>
  )
}
