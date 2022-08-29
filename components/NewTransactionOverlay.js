import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { createTransactionForUser } from "../utils"
import { Input, Button } from "@geist-ui/core"

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
                  <Input
                     className={styles.formInput}
                     onChange={(e) => setAmount(e.target.value)}
                  >
                     <b>Amount</b>
                  </Input>
               </div>
               <div className={styles.inputGroup}>
                  <Input
                     className={styles.formInput}
                     onChange={(e) => setType(e.target.value)}
                  >
                     <b>Type</b>
                  </Input>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup} id={styles.description}>
                  <Input
                     className={styles.formInput}
                     onChange={(e) => setDescription(e.target.value)}
                     width={"100%"}
                  >
                     <b>Description</b>
                  </Input>
               </div>
            </div>

            <div className={styles.actionButtons}>
               {/* TODO: error handling) */}
               <Button
                  type={"success"}
                  auto
                  onClick={() => {
                     createTransactionForUser(
                        props.uid,
                        parseInt(amount),
                        type,
                        description
                     )
                  }}
               >
                  Submit
               </Button>
               <Button
                  type="abort"
                  auto
                  ghost
                  onClick={() => props.dismiss()}
               >
                  {" "}
                  Cancel{" "}
               </Button>
            </div>
         </div>
      </div>
   )
}
