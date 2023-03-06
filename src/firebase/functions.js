import { db } from "./config"
import collectionType from "./types"
import { getCollection, getDocsByDate, getDocById } from "./utils"
import { addMinutes } from '@/ultilities/time'

const getStaffList = async () => {
	const data = []

	await getCollection( db, collectionType.staff, "name" ).then( res => res.forEach( s => {
		data.push({
			id: s.id,
			title: s.name,
			label: s.name
		})
	} ) )
	
	return data
}

const getServiceList = async () => {
	const data = []

	await getCollection( db, collectionType.service, "name" ).then( res => res.forEach( s => {
		data.push({
			id: s.id,
			title: s.name,
			label: s.name,
			price: s.price,
			duration: s.duration
		})
	} ) )

	return data
}

const getClientList = async () => {
	const data = []

	await getCollection( db, collectionType.client, "name" ).then( res => res.forEach( c => {
		data.push({
			id: c.id,
			title: c.name,
			label: c.name,
			email: c.email ?? null,
			phone: c.phone ?? null
		})
	} ))

	return data
}

export { getStaffList, getServiceList, getClientList }