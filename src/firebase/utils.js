import { collection, doc, getDocs, getDoc, Timestamp, query, where } from "firebase/firestore"

const getCollection = async (db, name) => {
	const data = collection(db, name);
	const dataSnapshot = await getDocs(data);
	
	return dataSnapshot.docs.map(doc => ({...doc.data(), id:doc.id }));
}

const getDocById = async (db, collection, id) => {
	const docRef = doc(db, collection, id)
	const docSnap = await getDoc(docRef)

	return docSnap.data()
}

const getDocsByDate = async (db, collectionName, entityDateName, condition, value) => {
	const dateToQuery = Timestamp.fromDate(new Date(value))
	const q = query(collection(db, collectionName), where(entityDateName, condition, dateToQuery))
	const querySnapShot = await getDocs(q)

	return querySnapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
}

export { getCollection, getDocById, getDocsByDate }