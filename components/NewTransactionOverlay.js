import styles from "../styles/Overlays.module.css"
import { useEffect, useRef } from "react"
import { signIn, signOut, useSession } from "next-auth/react"

export default function NewTransactionOverlay(props) {
   const { data: session, status } = useSession()

   return (
      <div className={styles.newTransactionOverlayContainer}>
         <div className={styles.newTransactionContainer}>
            <div className={styles.overlayHeader}>
               <b>New Transaction</b> {session && (<p>for {session?.name}</p>)}
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                     <b>Date</b>
                  </label>
                  <input className={styles.formInput}></input>
               </div>
               <div className={styles.inputGroup}>
                     <label className={styles.inputLabel}>
                        <b>Amount</b>
                     </label>
                  <input className={styles.formInput}></input>
               </div>
               <div className={styles.inputGroup}>
                     <label className={styles.inputLabel}>
                        <b>Type</b>
                     </label>
                  <input className={styles.formInput}></input>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup} id={styles.description}>
                  <label className={styles.inputLabel}>
                     <b>Description</b>
                  </label>
                  <input className={styles.formInput}></input>
               </div>
            </div>
            
            <div className={styles.actionButtons}>
               <button>
                  Submit
               </button>
               <button
                  className={styles.cancelButton}
                  onClick={() => props.dismiss()}
               >
                  {" "}
                  Cancel{" "}
               </button>
            </div>
         </div>
      </div>
   )
}
