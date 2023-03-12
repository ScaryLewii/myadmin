import dayjs from "dayjs";
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

const getDocsByDate = async (db, collectionName, fieldDateName, condition, value) => {
	const dateToQuery = Timestamp.fromDate(new Date(value))
	const q = query(collection(db, collectionName), where(fieldDateName, condition, dateToQuery))
	const querySnapShot = await getDocs(q)

	return querySnapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
}

const getDocsByMonths = async (db, collectionName, fieldDateName) => {
	const dateBefore = Timestamp.fromDate(new Date( dayjs(new Date()).subtract(2, 'month') ))
	const dateAfter = Timestamp.fromDate(new Date( dayjs(new Date()).add(3, 'month')) )
	const q = query(
					collection(db, collectionName),
					where(fieldDateName, ">", dateBefore),
					where(fieldDateName, "<", dateAfter),
				)
	
	const querySnapShot = await getDocs(q)

	return querySnapShot.docs.map(doc => ({...doc.data(), id: doc.id}))
}

const updateDocument = (db, collectionName, collectionId, data) => {
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

const checkExistDocument = async( db, collectionName, fieldName, fieldValue ) => {
	const docRef = collection( db, collectionName )
	const q = query( docRef, where( fieldName, "==", fieldValue ) )
	const querySnapShot = await getDocs(q)

	return querySnapShot.docs.map(doc => ({...doc.data(), id: doc.id}))[0]
}

export { getCollection, getDocById, getDocsByDate, getDocsByMonths, updateDocument, createDocument, checkExistDocument }