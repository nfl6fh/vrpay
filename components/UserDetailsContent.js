import styles from "../styles/Overlays.module.css"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Input, Button, Modal, Select } from "@geist-ui/core"
import {
   formatMoney,
   getDateFormatting,
   approveTransaction,
   isTransactionValid,
   deleteUser,
   updateUser,
   getRoleFormatting,
} from "../utils"
import Router from "next/router"

export default function NewTransactionContent(props) {
   const { data: session, status } = useSession()
   const [isEditing, setIsEditing] = useState(false)
   const [name, setName] = useState(props.user.name)
   const [gradYear, setGradYear] = useState(props.user.grad_year)
   const [email, setEmail] = useState(props.user.email)
   const [role, setRole] = useState(props.user.role)
   const [isEdited, setIsEdited] = useState(false)
   
   return (
      <div
         className={styles.container}
         onClick={() => console.log("props", props)}
      >
         <div className={styles.container}>
            <Modal.Title style={{ textTransform: "None" }}>
               {isEditing ? "Editing d" : "D"}etails for user {props?.user?.name ? props.user.name : "no name"}
            </Modal.Title>
            {isEditing ? (
            <div>
                <div className={styles.inputSection}>
                <div className={styles.inputGroup}>
                    <Input
                        className={styles.formInput}
                        onChange={(e) => setName(e.target.value)}
                        initialValue={isEdited ? name : props?.user?.name}
                        width={"100%"}
                     >
                        <b>Name</b>
                     </Input>
                </div>
                <div className={styles.inputGroup}>
                    {/* <Input
                        className={styles.formInput}
                        onChange={(e) => setRole(e.target.value)}
                        initialValue={isEdited ? role : getRoleFormatting(props?.user?.role)}
                        width={"100%"}
                     >
                        <b>Role</b>
                     </Input> */}
                    <b className={styles.label}>Role</b>
                    <p>{getRoleFormatting(props?.user?.role)}</p>
                </div>
                <div className={styles.inputGroup}>
                    <Input
                        className={styles.formInput}
                        onChange={(e) => setGradYear(e.target.value)}
                        initialValue={isEdited ? gradYear : props?.user?.grad_year}
                        width={"100%"}
                     >
                        <b>Grad Year</b>
                     </Input>
                </div>
                </div>
                <div className={styles.inputSection}>
                <div className={styles.inputGroup}>
                    <Input
                        className={styles.formInput}
                        onChange={(e) => setEmail(e.target.value)}
                        initialValue={isEdited ? email : props?.user?.email}
                        width={"100%"}
                     >
                        <b>Email</b>
                     </Input>
                </div>
                </div>
            </div>
            ) : (
            <div>
                <div className={styles.inputSection}>
                <div className={styles.inputGroup}>
                    <div>
                        <b className={styles.label}>Name</b>

                        <p>{isEdited ? name : props?.user?.name}</p>
                    </div>
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
            </div>
            )}

            <div className={styles.actions}>
            {true && (
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
                        disabled={isEdited || isEditing && !name && !gradYear && !email} 
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
