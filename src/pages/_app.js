import Layout from '@/components/layout/layout'
import '@/styles/globals.css'

import { AppContextProvider } from '@/context/context'

export default function App({ Component, pageProps }) {
	return (
		<AppContextProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</AppContextProvider>
	)
}