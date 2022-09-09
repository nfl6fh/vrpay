import Router from "next/router"

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

export const approveTransaction = async (trans_id) => {
    const body = { trans_id }
    try {
       console.log(trans_id)
       await fetch("/api/approve_transaction", {
          method: "POST",
          headers: { "content-Type": "application/json"},
          body: JSON.stringify(body),
       })
       .then((res) => {
          Router.reload()
       })
    } catch (error) {
       console.log("error approving transaction:", error)
    }
 }

 export const denyTransaction = async (trans_id) => {
    const body = { trans_id }

    try {
       console.log(trans_id)
       await fetch("/api/deny_transaction", {
          method: "POST",
          headers: { "content-Type": "application/json"},
          body: JSON.stringify(body),
       })
       .then((res) => {
          Router.reload()
       })
    } catch (error) {
       console.log("error denying transaction:", error)
    }
 }

 export const createTransactionForUser = async ( uid, amount, type, description, applyTo ) => {
    const body = { uid, amount, type, description, applyTo }

    try {
       await fetch("/api/create_transaction_for_user", {
          method: "POST",
          headers: { "content-Type": "application/json"},
          body: JSON.stringify(body),
       })
       .then((res) => {
          Router.reload()
       })
    } catch (error) {
       console.log("error denying transaction:", error)
    }
 }

 export const updateBalance = async ( uid, amount ) => {
      const body = { uid, amount }
   
      try {
         await fetch("/api/update_balance", {
            method: "POST",
            headers: { "content-Type": "application/json"},
            body: JSON.stringify(body),
         })
         .then((res) => {
            Router.reload()
         })
      } catch (error) {
         console.log("error updating balance:", error)
      }
 }