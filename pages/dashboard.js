import { useSession } from "next-auth/react"
import { prisma } from "../lib/prisma.js"
import styles from "../styles/Admin.module.css"
import Loading from "../components/Loading"
import { useState } from "react"
import Router from "next/router.js"

// Create our number formatter.
var formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
 
   // These options are needed to round to whole numbers if that's what you want.
   //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
   //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
 });

export const getServerSideProps = async () => {
   var unverified_users = await prisma.user.findMany({
      where: { is_verified: false },
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

   unverified_users = unverified_users?.sort((a, b) =>
      a.name.localeCompare(b.name)
   )
   verified_users = verified_users?.sort((a, b) => a.name.localeCompare(b.name))

   console.log("unverified_users:", unverified_users)
   console.log("verified_users:", verified_users)

   return { props: { unverified_users, verified_users } }
}

export default function Admin(props) {
   const { data: session, status } = useSession()

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
      });
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
      });
    } catch (error) {
      console.log("error verifying user:", error)
    }
  }

   if (session?.is_verified && session.role === "admin") {
      return (
         <div className={styles.container}>
            <h1 className={styles.title}>Dashboard</h1>
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

            <h2 className={styles.sectionHeading}>Verified Users</h2>
            <table className={styles.table}>
               <thead>
                  <tr className={styles.verifiedUsersTR}>
                     <th>Name</th>
                     <th className={styles.emailSection}>Total Due</th>
                  </tr>
               </thead>
               <tbody>
                  {props.verified_users?.map((user) => (
                     <tr>
                        <td>
                           <div className={styles.nameSection}>
                              <a className={styles.tableName} onClick={() => {Router.push("/u/[id]", `/u/${user.id}`)}}>
                                 {user.name}
                              </a>
                           </div>
                        </td>
                        <td>{formatter.format(user.total_due)}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      )
   } else {
      return <Loading />
   }
}
