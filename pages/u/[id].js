import styles from "../../styles/UserPage.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
   toSentenceCase,
   getDateFormatting,
   approveTransaction,
   denyTransaction,
   formatMoney,
   sentenceCase,
   getRoleFormatting,
} from "../../utils"
import Loading from "../../components/Loading"
import { prisma } from "../../lib/prisma.js"
import {
   Button,
   Text,
   useModal,
   Modal,
   Table,
   ButtonGroup,
} from "@geist-ui/core"
import { UserX, Plus, ArrowUp } from "@geist-ui/icons"
import Router from "next/router"
import NewTransactionContent from "../../components/NewTransactionContent"
import TransactionDetailsContent from "../../components/TransactionDetailsContent"
import { isTypeParameterDeclaration } from "typescript"

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
   const [viewingDetails, setViewingDetails] = useState(false)
   const [relevantTransaction, setRelevantTransaction] = useState(null)

   if (status === "loading") {
      return <Loading />
   }

   function getGradYearFormatting(gy) {
      if (gy === null) {
         return ""
      }
      return "('" + gy.slice(gy.length - 2) + ")"
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
      if (a.status !== b.status) {
         return tmap.get(a.status) - tmap.get(b.status)
      }
      const date1 = new Date(a.updatedAt)
      const date2 = new Date(b.updatedAt)
      return date2.getTime() - date1.getTime()
   }

   function getStatusStyle(status) {
      console.log("Status is ", status)
      const obj = {
         color: status === "pending" ? "red" : "black",
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

   const cellText = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            style={getItemStyle(rowData?.status)}
         >
            {value}
         </p>
      )
   }

   const cellTextStatus = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            color="red"
            style={getStatusStyle(value)}
         >
            {sentenceCase(value)}
         </p>
      )
   }

   const cellDate = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            style={getItemStyle(rowData?.status)}
         >
            {getDateFormatting(value)}
         </p>
      )
   }

   const cellMoney = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            style={{
               justifyContent: "right",
               flexGrow: "1",
               ...getItemStyle(rowData?.status),
            }}
         >
            {formatMoney.format(value)}
         </p>
      )
   }

   const transactionOptions = (value, rowData, rowIndex) => {
      return (
         <Text
            auto
            style={{ cursor: "pointer" }}
            onClick={() => {
               setViewingDetails(true)
               setRelevantTransaction(rowData)
               setVisible(true)
            }}
         >
            {rowData?.status === "pending" ? (session?.role == "admin" ? "Edit/Approve" : "Edit") : "View Details"}
         </Text>
      )
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
                  {formatMoney.format(props.total_due)}
               </span>
            </p>
         </div>
         <div className={styles.belowName}>
            <div className={styles.email}>{props.email}</div>
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
                  onClick={() => {
                     setViewingDetails(false)
                     setVisible(true)
                  }}
                  auto
                  className={styles.newTransaction}
                  type="success"
               >
                  New RaR or Transaction
               </Button>
               <Modal {...bindings}>
                  {viewingDetails ? (
                     <TransactionDetailsContent
                        transaction={relevantTransaction}
                        setVisible={setVisible}
                        uid={props.id}
                        name={props.name}
                     />
                  ) : (
                     <NewTransactionContent
                        setVisible={setVisible}
                        uid={props.id}
                        name={props.name}
                     />
                  )}
               </Modal>
            </div>
         </div>
         {(!props.transactions || props.transactions.length === 0) && (
            <div>No transactions found</div>
         )}
         <div>
            {props.transactions?.length !== 0 && (
               <Table
                  data={props.transactions
                     .sort(transactionSorter)
                     .filter((transaction) => transaction.status !== "denied")}
               >
                  <Table.Column
                     prop="updatedAt"
                     label="Updated"
                     render={cellDate}
                     width="6%"
                  />
                  <Table.Column
                     prop="type"
                     label="Type"
                     render={cellText}
                     width="6%"
                  />

                  <Table.Column
                     prop="description"
                     label="Description"
                     render={cellText}
                     className={styles.description}
                  />

                  <Table.Column
                     prop="amount"
                     label="Amount"
                     render={cellMoney}
                     width="6%"
                  />
                  <Table.Column
                     prop="status"
                     label="Status"
                     render={cellTextStatus}
                     width="6%"
                  />
                  <Table.Column
                     prop="actions"
                     label="Actions"
                     render={transactionOptions}
                     width={"120px"}
                  />
               </Table>
            )}
         </div>
      </div>
   )
}
