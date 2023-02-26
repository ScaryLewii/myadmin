import { collection, doc, getDocs, getDoc } from "firebase/firestore"

const getCollection = async (db, name) => {
	const data = collection(db, name);
	const dataSnapshot = await getDocs(data);
	const results = dataSnapshot.docs.map(doc => ({...doc.data(), id:doc.id }));
	return results;
}

const getDocById = async (db, collection, id) => {
	const docRef = doc(db, collection, id)
	const docSnap = await getDoc(docRef)
	const result = docSnap.data()

	return result
}

export { getCollection, getDocById }