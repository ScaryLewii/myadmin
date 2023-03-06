import { collection, doc, getDocs, getDoc, Timestamp, query, where, updateDoc, addDoc, orderBy } from "firebase/firestore"

const getCollection = async (db, name, field) => {
	const q = query(collection(db, name), orderBy(field, "asc"))
	const querySnapshot = await getDocs(q);
	
	return querySnapshot.docs.map(doc => ({...doc.data(), id:doc.id }));
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

const updateDocument = async(db, collectionName, collectionId, data) => {
	const docRef = doc(db, collectionName, collectionId);

	data ??= {
		updated: true
	}

	return updateDoc(docRef, data)
}

const createDocument = async (db, collectionName, data) => {
	const docRef = await addDoc(collection(db, collectionName), data);

	return docRef
}

export { getCollection, getDocById, getDocsByDate, updateDocument, createDocument }