import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { createTransactionForUser } from "../utils"

export default function NewTransactionOverlay(props) {
   const { data: session, status } = useSession()

   const [amount, setAmount] = useState()
   const [type, setType] = useState()
   const [description, setDescription] = useState()

   return (
      <div className={styles.newTransactionOverlayContainer}>
         <div className={styles.newTransactionContainer}>
            <div className={styles.overlayHeader}>
               <b>New Transaction</b> <p>for {props.name}</p>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                     <b>Amount</b>
                  </label>
                  <input
                     className={styles.formInput}
                     onChange={(e) => setAmount(e.target.value)}
                  ></input>
               </div>
               <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>
                     <b>Type</b>
                  </label>
                  <input
                     className={styles.formInput}
                     onChange={(e) => setType(e.target.value)}
                  ></input>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup} id={styles.description}>
                  <label className={styles.inputLabel}>
                     <b>Description</b>
                  </label>
                  <input
                     className={styles.formInput}
                     onChange={(e) => setDescription(e.target.value)}
                  ></input>
               </div>
            </div>

            <div className={styles.actionButtons}>
               {/* TODO: error handling) */}
               <button
                  onClick={() => {
                     console.log("what's good")
                     console.log("uid:", props.uid)
                     console.log("amount: ", amount)
                     console.log("type: ", type)
                     console.log("description: ", description)
                     createTransactionForUser(
                        props.uid,
                        parseInt(amount),
                        type,
                        description
                     )
                  }}
               >
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
