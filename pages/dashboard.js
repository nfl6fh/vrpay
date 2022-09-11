import { useSession } from "next-auth/react"
import { prisma } from "../lib/prisma.js"
import styles from "../styles/Admin.module.css"
import Loading from "../components/Loading"
import { useState } from "react"
import { approveTransaction, denyTransaction, formatMoney, getRoleFormatting } from "../utils.js"
import Router from "next/router.js"
import { Input, Button, Modal, useModal, Table, Text } from "@geist-ui/core"
import NewTransactionContent from "../components/NewTransactionContent.js"

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

   function userSorter(a, b) {
      return b.total_due - a.total_due
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
         <Text auto scale={1 / 2} font="12px" className={styles.tableCell}>
            {value}
         </Text>
      )
   }

   const athleteRole = (value, rowData, rowIndex) => {
      return (
         <Text auto scale={1 / 2} font="14px" className={styles.tableCell}>
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
            className={styles.tableCell}
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => {
               Router.push("/u/[id]", `/u/${rowData?.id}`)
            }}
         >
            {value}
         </p>
      )
   }

   const cellMoney = (value, rowData, rowIndex) => {
      return (
         <p
            auto
            scale={1 / 2}
            font="12px"
            className={styles.tableCell}
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
         <p auto scale={1 / 2} font="12px" className={styles.tableCell}>
            {rowData?.user?.name}
         </p>
      )
   }

   const transactionOptions = (value, rowData, rowIndex) => {
      return (
         <p auto style={{ cursor: "pointer" }}>
            Edit/Delete
         </p>
      )
   }

   if (session?.is_verified && session.role === "admin") {
      return (
         <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
            <Button auto onClick={() => setVisible(true)}>
               New transaction
            </Button>
            <Modal {...bindings}>
               <NewTransactionContent setVisible={setVisible} />
            </Modal>
            {props.unverified_users?.length > 0 && (
               <div className={styles.unverifiedUsersContainer}>
                  <h2 className={styles.sectionHeading}>Unverified Users</h2>
                  <table className={styles.table}>
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th className={styles.emailSection}>Email</th>
                           <th className={styles.verifySection}>Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        {props.unverified_users.map((user) => (
                           <tr>
                              <td>
                                 <div className={styles.nameSection}>
                                    <p className={styles.tableName}>
                                       {user.name}
                                    </p>
                                 </div>
                              </td>
                              <td>{user.email}</td>
                              <td className={styles.verifyTD}>
                                 <a
                                    onClick={() => verifyUser(user.id)}
                                    className={styles.verifyButton}
                                 >
                                    Verify
                                 </a>
                                 <a
                                    onClick={() => deleteUser(user.id)}
                                    className={styles.verifyButton}
                                 >
                                    Delete
                                 </a>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            )}

            {props.pending_transactions?.length > 0 && (
               <div>
                  <h2 className={styles.sectionHeading}>
                     Pending Transactions
                  </h2>
                  <Table data={props.pending_transactions}>
                     <Table.Column
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

            <h2 className={styles.sectionHeading}>Verified Users</h2>
            <Table data={props.verified_users}>
               <Table.Column prop="name" label="Athlete" render={athleteName} />
               <Table.Column prop="role" label="Role" width="10%" render={athleteRole} />
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
