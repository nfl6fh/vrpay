import { useSession } from "next-auth/react"
import { prisma } from "../lib/prisma.js"
import styles from "../styles/Admin.module.css"
import Loading from "../components/Loading"
import { useState } from "react"
import {
   formatMoney,
   getRoleFormatting,
} from "../utils.js"
import Router from "next/router.js"
import { Input, Button, Modal, useModal, Table, Text } from "@geist-ui/core"
import TransactionDetailsContent from "../components/TransactionDetailsContent"
import NewTransactionContent from "../components/NewTransactionContent"

export const getServerSideProps = async () => {
   var unverified_users = await prisma.user.findMany({
      where: { is_verified: false },
   })

   var pending_transactions = await prisma.transaction.findMany({
      where: { status: "pending" },
      include: {
         user: {
            select: {
               name: true,
            },
         },
      },
   })

   var verified_users = await prisma.user.findMany({
      where: { is_verified: true },
   })

   var today = new Date();
   var mm = String(today.getMonth() + 1).padStart(2, '0');
   var yyyy = today.getFullYear();
   
   var year = mm >= '06' ? yyyy : yyyy - 1;
   var yearString = year.toString();

   var graduating_users = await prisma.user.findMany({
      where: { grad_year: yearString },
   })


   unverified_users.map((user) => {
      if (user.createdAt !== null) {
         user.createdAt = user.createdAt.toString()
      }
      if (user.updatedAt !== null) {
         user.updatedAt = user.updatedAt.toString()
      }
   })

   verified_users.map((user) => {
      if (user.createdAt !== null) {
         user.createdAt = user.createdAt.toString()
      }
      if (user.updatedAt !== null) {
         user.updatedAt = user.updatedAt.toString()
      }
   })

   pending_transactions.map((transaction) => {
      if (transaction.createdAt !== null) {
         transaction.createdAt = transaction.createdAt.toString()
      }
      if (transaction.updatedAt !== null) {
         transaction.updatedAt = transaction.updatedAt.toString()
      }
   })

   unverified_users = unverified_users?.sort((a, b) =>
      a.name.localeCompare(b.name)
   )
   verified_users = verified_users?.sort((a, b) => a.name.localeCompare(b.name))

   pending_transactions = pending_transactions?.sort((a, b) =>
      a.user.name.localeCompare(b.user.name)
   )

   console.log("unverified_users:", unverified_users)
   console.log("verified_users:", verified_users)
   console.log("pending_transactions:", pending_transactions)

   return { props: { unverified_users, verified_users, pending_transactions } }
}

export default function Admin(props) {
   const { data: session, status } = useSession()
   const { visible, setVisible, bindings } = useModal()
   const [relevantTransaction, setRelevantTransaction] = useState(null)
   const [relevantUID, setRelevantUID] = useState(null)
   const [relevantName, setRelevantName] = useState(null)
   const [viewingDetails, setViewingDetails] = useState(false)

   if (status === "loading") {
      return <Loading />
   }

   const deleteUser = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/delete_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         }).then((res) => {
            Router.reload()
         })
      } catch (error) {
         console.log("error deleting user:", error)
      }
   }

   const verifyUser = async (user_id) => {
      const body = { user_id }

      try {
         console.log(user_id)
         await fetch("/api/verify_user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
         }).then((res) => {
            Router.reload()
         })
      } catch (error) {
         console.log("error verifying user:", error)
      }
   }

   const cellText = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2} font="12px">
            {value}
         </Text>
      )
   }

   const athleteRole = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2} font="14px">
            {/* {rowData?.is_rookie} */}
            {getRoleFormatting(value, rowData.is_rookie)}
         </Text>
      )
   }

   const athleteName = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
               Router.push("/u/[id]", `/u/${rowData?.id}`)
            }}
         >
            {value}
         </p>
      )
   }

   const unverifiedName = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            className={styles.nameSection}
         >
            {value}
         </p>
      )
   }

   const emailText = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            className={styles.emailSection}
         >
            {value}
         </p>
      )
   }

   const userActions = (value, rowData, rowIndex) => {
      return (
         <div className={styles.verifyTD}>
            <Text
               auto
               scale={1 / 2}
               font="14px"
               className={styles.verifyButton}
               onClick={() => verifyUser(rowData.id)}
            >
               Verify
            </Text>
            <Text
               auto
               scale={1 / 2}
               font="14px"
               className={styles.verifyButton}
               onClick={() => deleteUser(rowData.id)}
            >
               Delete
            </Text>
         </div>
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
            }}
         >
            {formatMoney.format(value)}
         </p>
      )
   }

   const transactionAthlete = (value, rowData, rowIndex) => {
      return (
         <p auto scale={1 / 2} font="12px">
            {rowData?.user?.name}
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
            Edit/Approve
         </Text>
      )
   }

   if (session?.is_verified && session.role === "admin") {
      return (
         <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <Button
               auto
               onClick={() => {
                  setViewingDetails(false)
                  setVisible(true)
               }}
               style={{ marginTop: "16px" }}
            >
               New transaction
            </Button>
            <Modal {...bindings}>
               {viewingDetails ? (
                  <TransactionDetailsContent
                     transaction={relevantTransaction}
                     setVisible={setVisible}
                     uid={relevantUID}
                     name={relevantName}
                  />
               ) : (
                  <NewTransactionContent setVisible={setVisible} />
               )}
            </Modal>
            {props.unverified_users?.length > 0 && (
               <div className={styles.unverifiedUsersContainer}>
                  <h2 className={styles.sectionHeading}>Unverified Users</h2>
                  <Table data={props.unverified_users}>
                     <Table.Column
                        prop="name"
                        label="Name"
                        render={unverifiedName}
                     />
                     <Table.Column
                        prop="email"
                        label="Email"
                        render={emailText}
                     />
                     <Table.Column
                        prop="actions"
                        label="Actions"
                        render={userActions}
                     />
                  </Table>
               </div>
            )}

            {props.pending_transactions?.length > 0 && (
               <div>
                  <h2 className={styles.sectionHeading}>
                     Pending Transactions
                  </h2>
                  <Table data={props.pending_transactions}>
                     <Table.Column
                        className={styles.tableCell}
                        prop="name"
                        label="Athlete"
                        render={transactionAthlete}
                        width="12%"
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
                     />
                     <Table.Column
                        prop="amount"
                        label="Amount"
                        render={cellMoney}
                        width="8%"
                     />
                     <Table.Column
                        prop="actions"
                        label="Actions"
                        width="8%"
                        render={transactionOptions}
                     />
                  </Table>
               </div>
            )}

            <h2 className={styles.sectionHeading}>Athletes</h2>
            <Table data={props.verified_users}>
               <Table.Column prop="name" label="Athlete" render={athleteName} />
               <Table.Column
                  prop="role"
                  label="Role"
                  render={athleteRole}
                  width="120px"
                  scale="1/2"
               />
               <Table.Column
                  prop="total_due"
                  label="Total Due"
                  width="10%"
                  render={cellMoney}
               />
            </Table>
         </div>
      )
   } else {
      return <Loading />
   }
}
