import styles from "../styles/CustomNavbar.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import { Router } from "next/router"

export default function CustomNavbar(props) {
   const { data: session, status } = useSession()

   return (
      <div className={styles.navbar}>
         <a className={styles.brand} href="/">
            VRPay
         </a>

         <div className={styles.verifiedSessionButtons}>
            {session?.role == "admin" && (
               <a href="/dashboard" className={styles.adminButton}>
                  Admin
               </a>
            )}
         </div>

         <div className={styles.navbarRight}>
            {session?.user && (
               <a
                  className={styles.navButton} 
                  href={`/api/auth/signout`}
                  onClick={(e) => {
                     e.preventDefault()
                     signOut({
                        callbackUrl: `${window.location.origin}`,
                     })
                  }}
               >
                  Sign Out
               </a>
            )}
            {!session?.user && (
               <p className={styles.navButton} onClick={() => signIn("google")}>
                  Sign in
               </p>
            )}
         </div>
      </div>
   )
}
