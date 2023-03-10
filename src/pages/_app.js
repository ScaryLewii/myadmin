import Layout from '@/components/layout/layout'
import '@/styles/globals.css'

// import { CounterContextProvider } from '@/context/counter'
import { ClientContextProvider } from '@/context/client'
import { ServiceContextProvider } from '@/context/service'
import { BookingContextProvider } from '@/context/booking'
import { BlockingContextProvider } from '@/context/blocking'
import { StaffContextProvider } from '@/context/staff'

export default function App({ Component, pageProps }) {
	return (
		<ServiceContextProvider>
			<StaffContextProvider>
				<ClientContextProvider>
					<BlockingContextProvider>
						<BookingContextProvider>
							<Layout>
								<Component {...pageProps} />
							</Layout>
						</BookingContextProvider>
					</BlockingContextProvider>
				</ClientContextProvider>
			</StaffContextProvider>
		</ServiceContextProvider>
	)
}