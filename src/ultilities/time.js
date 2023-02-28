const addDays = function(str, days) {
	const myDate = new Date(str);
	myDate.setDate(myDate.getDate() + parseInt(days));
	return myDate;
}

const addMinutes = function(time, minutes) {
	const myDate = new Date( time.seconds * 1000 );
	myDate.setMinutes(myDate.getMinutes() + parseInt( minutes ));
	return myDate;
}

export { addDays, addMinutes }