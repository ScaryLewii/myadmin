import Layout from '@/components/layout/layout'
import { getServiceList, getStaffList } from '@/firebase/functions'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

App.getInitialProps = async ctx => {
  const staffsData = await getStaffList()
  const servicesData = await getServiceList()

	return { staffs: staffsData, services: servicesData }
}
