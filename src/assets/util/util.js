export function formatDate(dateObj) {
	//日期转yyyy-MM-dd
	var date = new Date(dateObj)
	var y = 1900 + date.getYear()
	var m = '0' + (date.getMonth() + 1)
	var d = '0' + date.getDate()
	var h = date.getHours()
	var ms = date.getMinutes()
	var s = '0' + date.getSeconds()
	return y + '-' + m.substring(m.length - 2, m.length) + '-' + d.substring(d.length - 2, d.length) + " " + h + ":" + ms + ":" + s.substring(s.length - 2, s.length)
}