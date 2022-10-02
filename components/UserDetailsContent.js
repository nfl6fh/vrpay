import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import {
   formatMoney,
   getDateFormatting,
   approveTransaction,
   isTransactionValid,
   deleteTransaction,
   updateTransaction,
   getRoleFormatting,
} from "../utils"
import Router from "next/router"

export default function NewTransactionContent(props) {
   const { data: session, status } = useSession()
   const [isEditing, setIsEditing] = useState(false)
   const [name, setName] = useState()
   const [gradYear, setGradYear] = useState()
   const [email, setEmail] = useState()
   const [role, setRole] = useState()
   const [isEdited, setIsEdited] = useState(false)
   
   return (
      <div
         className={styles.container}
         onClick={() => console.log("props", props)}
      >
         <div className={styles.container}>
            <Modal.Title style={{ textTransform: "None" }}>
               Details for user {props?.user?.name ? props.user.name : "no name"}
            </Modal.Title>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  {isEditing ? (
                     <Input
                        className={styles.formInput}
                        onChange={(e) => setName(e.target.value)}
                        initialValue={isEdited ? amount : props?.user?.name}
                        width={"100%"}
                     >
                        <b>Name</b>
                     </Input>
                  ) : (
                     <div>
                        <b className={styles.label}>Name</b>

                        <p>{isEdited ? amount : props?.user?.name}</p>
                     </div>
                  )}
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Role</b>
                  <p>{getRoleFormatting(props?.user?.role)}</p>
               </div>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Grad Year</b>
                  <p>{props?.user?.grad_year}</p>
               </div>
            </div>
            <div className={styles.inputSection}>
               <div className={styles.inputGroup}>
                  <b className={styles.label}>Email</b>
                  <p>{props?.user?.email}</p>
               </div>
            </div>

            <div className={styles.actions}>
            {(props?.transaction?.status === "pending" || session?.role == "admin") && (
                  <div>
                     <Button
                        auto
                        type="abort"
                        onClick={() => {
                           if (isEditing) {
                              setIsEditing(false)
                              //handle cancel
                           } else {
                              setIsEditing(true)
                           }
                        }}
                     >
                        {isEditing ? "Cancel" : "Edit"}
                     </Button>
                     <Button
                        auto
                        type={isEditing ? "success" : "error"}
                        onClick={() => {
                           if (isEditing) {
                              updateUser(props?.user?.id, name, gradYear, role, email),
                              setIsEditing(false),
                              setIsEdited(true)
                           } else {
                              deleteUser(props?.user?.id)
                           }
                        }}
                        // disabled={isEditing || isEdited}
                     >
                        {isEditing ? "Save" : "Delete"}
                     </Button>
                  </div>
               )}
            </div>
         </div>
      </div>
   )
}
