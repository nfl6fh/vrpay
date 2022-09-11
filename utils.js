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

 export const updateUserRole = async ( role, uid) => {
      const body = { role, uid }
   
      try {
         await fetch("/api/update_user_role", {
            method: "POST",
            headers: { "content-Type": "application/json"},
            body: JSON.stringify(body),
         })
         .then((res) => {
            Router.reload()
         })
      } catch (error) {
         console.log("error updating user:", error)
      }
   }

export var formatMoney = new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD",
})

export var sentenceCase = (str) => {
   return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
   })
}

export function getRoleFormatting(role, is_rookie) {
   var toReturn = ""

   // if (!role && !is_rookie) {
   //    return ""
   // }

   if (is_rookie) {
      toReturn += "Rookie "
   }
   if (role === "") {
      toReturn += "Athlete"
   }
   if (role === "admin") {
      toReturn += "Admin"
   }

   return toReturn
}