import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import { formatMoney, getDateFormatting } from "../utils"

export default function NewTransactionContent(props) {
   return (
      <div
         className={styles.container}
         onClick={() => console.log("props", props)}
      >
         <div className={styles.container}>
            <Modal.Title style={{ textTransform: "None" }}>
               Viewing Transaction {props.name ? "for " + props.name : ""}
            </Modal.Title>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Amount</b>
                  <p>{formatMoney.format(props?.transaction?.amount)}</p>
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Type</b>
                  <p>{props?.transaction?.type}</p>
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Last updated</b>
                  <p>{getDateFormatting(props?.transaction?.updatedAt)}</p>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Description</b>
                  <p>{props?.transaction?.description}</p>
               </div>
            </div>

            <div className={styles.actions}>
               <Button auto type="abort">
                  Edit
               </Button>
               <Button auto type="error">
                  Delete
               </Button>
               {props.transaction.status === "pending" && (
                  <Button auto type="success">
                     Approve
                  </Button>
               )}
            </div>
         </div>
      </div>
   )
}
