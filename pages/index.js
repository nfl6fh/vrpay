import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import Loading from "../components/Loading"
import Router from "next/router"
import { useEffect, useState } from "react"
import { updateUserRole } from "../utils"
import { Button, Text, Input, Select, Page } from "@geist-ui/core"

export default function Home() {
   const { data: session, status } = useSession()
   const [role, setRole] = useState("rookie")
   const [gradYear, setGradYear] = useState("")

   const handleRoleChange = (val) => {
      setRole(val)
      console.log(val)
   }

   const handleGradYearChange = (val) => {
      setGradYear(val)
      console.log(val)
   }

   useEffect(() => {
      console.log("session:", session)
   }, [session])

   if (status === "loading") {
      return <Loading />
   }

   if (session) {
      if (session.is_verified) {
         if (session.role && session.role !== "") {
            Router.push("/dashboard")
            return <Loading />
         } else {
            Router.push("/u/[id]", `/u/${session.uid}`)
            return <Loading />
         }
      } else {
         // pending page
         return (
            <Page className={styles.pendingPage}>
               <div className={styles.pendingContent}>
                  <Text h1 className={styles.verifyingTitle}>
                     We're verifying your account
                  </Text>
                  <Text p className={styles.verifyingSubtitle}>
                     While you're here, confirm the information below
                  </Text>
                  <div className={styles.roleSelection}>
                     <span>I am a </span>
                     <Select
                        placeholder="Role"
                        auto
                        onChange={handleRoleChange}
                        initialValue={session.is_rookie ? "rookie" : "varsity"}
                     >
                        <Select.Option value="rookie">
                           rookie athlete
                        </Select.Option>
                        <Select.Option value="varsity">
                           varsity athlete
                        </Select.Option>
                        <Select.Option value="coach">coach</Select.Option>
                     </Select>
                  </div>
                  <div className={styles.buttonContainer}>
                     <Button
                        className={styles.saveButton}
                        style={{ textTransform: "None" }}
                        onClick={() => updateUserRole(role, session.uid)}
                     >
                        Yea, that's correct
                     </Button>
                  </div>
               </div>
            </Page>
         )
      }
   } else {
      // user is not logged in
      return (
         <div className={styles.hasBackground}>
            <main className={styles.main}>
               <Text h1 className={styles.title}>
                  VRPay
               </Text>
               <Text h4 className={styles.subtitle}>
                  Cool name, eh?
               </Text>
               <br />
               <Button
                  className={styles.signInButton}
                  onClick={() => signIn("google")}
               >
                  Sign in with Google
               </Button>
            </main>
         </div>
      )
   }
}
