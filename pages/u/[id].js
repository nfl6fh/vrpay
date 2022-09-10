import styles from "../../styles/UserPage.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import {
   toSentenceCase,
   getDateFormatting,
   approveTransaction,
   denyTransaction,
} from "../../utils"
import Loading from "../../components/Loading"
import { prisma } from "../../lib/prisma.js"
import { Button, Text, useModal, Modal } from "@geist-ui/core"
import { UserX, Plus, ArrowUp } from "@geist-ui/icons"
import Router from "next/router"
import NewTransactionContent from "../../components/NewTransactionContent"

var formatter = new Intl.NumberFormat("en-US", {
   style: "currency",
   currency: "USD",

   // These options are needed to round to whole numbers if that's what you want.
   //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
   //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

const tmap = new Map()
tmap.set("pending", 0)
tmap.set("approved", 1)
tmap.set("denied", 2)

export const getServerSideProps = async ({ params }) => {
   const user = await prisma.user.findUnique({
      where: {
         id: String(params?.id),
      },
      include: {
         transactions: {
            select: {
               id: true,
               updatedAt: true,
               amount: true,
               status: true,
               type: true,
               description: true,
               semester: true,
               turningInCheck: true,
            },
         },
      },
   })

   console.log("id:", params?.id)
   console.log("user:", user)

   if (user.createdAt !== null) {
      user.createdAt = user.createdAt.toString()
   }
   if (user.updatedAt !== null) {
      user.updatedAt = user.updatedAt.toISOString()
   }
   if (user.transactions !== null) {
      for (const transaction of user.transactions) {
         if (transaction.updatedAt !== null) {
            transaction.updatedAt = transaction.updatedAt.toISOString()
         }
      }
   }

   console.log("transactions:", user.transactions)

   return {
      props: user,
   }
}

export default function UserPage(props) {
   const { data: session, status } = useSession()
   const { visible, setVisible, bindings } = useModal()

   if (status === "loading") {
      return <Loading />
   }

   //  useEffect(() => {
   //     console.log("props:", props)
   //  }, [])

   function getGradYearFormatting(gy) {
      if (gy === null) {
         return ""
      }
      return "('" + gy.slice(gy.length - 2) + ")"
   }

   function getRoleFormatting(role, is_rookie) {
      var toReturn = ""

      if (!role && !is_rookie) {
         return ""
      }

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

   const removeUser = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/remove_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         }).then((res) => {
            Router.push("/dashboard/")
         })
      } catch (error) {
         console.log("error removing user:", error)
      }
   }

   function transactionSorter(a, b) {
      var statusComp = tmap.get(a.status) - tmap.get(b.status)
      if (statusComp !== 0) {
         return statusComp
      }
      
      const date1 = new Date(a.updatedAt)
      const date2 = new Date(b.updatedAt)
      return date1.getTime() - date2.getTime()
   }

   function getStatusStyle(status) {
      const obj = {
         color:
            status === "pending"
               ? "red"
               : status === "denied"
               ? "Black"
               : "green",
         fontStyle: status === "pending" ? "italic" : "normal",
      }
      return obj
   }

   function getItemStyle(status) {
      const obj = {
         color: status === "pending" ? "grey" : "black",
         fontStyle: status === "pending" ? "italic" : "normal",
      }
      return obj
   }

   const makeAdmin = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/make_admin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         })
      } catch (error) {
         console.log("error making user admin:", error)
      }
   }

   return (
      <div className={styles.container}>
         <div className={styles.header}>
            <div>
               <p className={styles.name}>{props.name}</p>
               <p className={styles.gradYear}>
                  {getGradYearFormatting(props.grad_year)}
               </p>
               <p className={styles.role}>
                  {getRoleFormatting(props.role, props.is_rookie)}
               </p>
            </div>
            <p className={styles.totalDueContainer}>
               Total due:{" "}
               <span className={styles.totalDue}>
                  {formatter.format(props.total_due)}
               </span>
            </p>
         </div>

         <div className={styles.userActions}>
            {session?.role == "admin" && props.role != "admin" && (
               <div className={styles.adminActions}>
                  <Button
                     auto
                     icon={<ArrowUp />}
                     onClick={() => makeAdmin(props.id)}
                  >
                     Make Admin
                  </Button>
                  <Button
                     icon={<UserX />}
                     type="error"
                     ghost
                     auto
                     onClick={() => removeUser(props.id)}
                  >
                     Remove User
                  </Button>
               </div>
            )}
            <Button
               // style={{minWidth: "calc(14.5 * 16px)"}}
               icon={<Plus />}
               onClick={() => setVisible(true)}
               auto
               className={styles.newTransaction}
               type="success"
            >
               New RaR or Transaction
            </Button>
            <Modal {...bindings}>
               <NewTransactionContent setVisible={setVisible} uid={props.id} name={props.name} />
            </Modal>
         </div>
         <p>Transactions:</p>

         {(!props.transactions || props.transactions.length === 0) && (
            <div>No transactions found</div>
         )}
         <div>
            {props.transactions?.length !== 0 && (
               <table className={styles.table}>
                  <thead>
                     <tr>
                        <th className={styles.updatedCol}>Updated</th>
                        <th className={styles.amountCol}>Amount</th>
                        <th className={styles.typeCol}>Type</th>
                        <th className={styles.descriptionCol}>Description</th>
                        <th className={styles.statusCol}>Status</th>
                        <th className={styles.actionCol}>Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {props.transactions
                        .sort(transactionSorter)
                        .map((transaction) => (
                           <tr>
                              <td style={getItemStyle(transaction.status)}>
                                 {getDateFormatting(transaction.updatedAt)}
                              </td>
                              <td style={getItemStyle(transaction.status)}>
                                 {formatter.format(transaction.amount)}
                              </td>
                              <td style={getItemStyle(transaction.status)}>
                                 {transaction.type}
                              </td>
                              <td style={getItemStyle(transaction.status)}>
                                 {transaction.description}
                              </td>
                              <td style={getStatusStyle(transaction.status)}>
                                 {toSentenceCase(transaction.status)}
                              </td>
                              <td>
                                 {transaction.status === "pending" && (
                                    <a
                                       onClick={() =>
                                          displayTransactionOverlay(
                                             transaction.id
                                          )
                                       }
                                    >
                                       Edit/Approve
                                    </a>
                                 )}
                                 {transaction.status === "approved" && (
                                    <a
                                       onClick={() =>
                                          displayTransactionOverlay(
                                             transaction.id
                                          )
                                       }
                                    >
                                       Edit
                                    </a>
                                 )}
                              </td>
                           </tr>
                        ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   )
}
