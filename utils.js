export function toSentenceCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
     })
}

export function getDateFormatting(isoDate) {
    var date = new Date(isoDate)
    var year = date.getFullYear()
    var day = date.getDate()
    var month = date.getMonth() + 1
    return month + "/" + day + "/" + year
 }