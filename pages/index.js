import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import Loading from "../components/Loading"
import Router from "next/router"
import { useEffect, useState } from "react"

import { Button, Text, Input, Select } from "@geist-ui/core"

export default function Home() {
   const { data: session, status } = useSession()
   const [role, setRole] = useState("1")
   const [gradYear, setGradYear] = useState("")

   const handleRoleChange = (val) => {
      setRole(val)
      console.log(val)
   }

   const handleGradYearChange = (val) => {
      setGradyear(val)
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
            <div className={styles.container}>
               <main className={styles.main}>
                  <Text h1>Your account is getting verified</Text>
                  <Text p>Confirm the info below is correct (you cannot change this)</Text>
                  <div>
                     I am a{' '}
                  <Select placeholder="Role" auto onChange={handleRoleChange} initialValue={'1'}>
                     <Select.Option value="1">rookie athlete</Select.Option>
                     <Select.Option value="2">varsity athlete</Select.Option>
                     <Select.Option value="3">coach</Select.Option>
                  </Select>
                  </div>
                  <Button>Save</Button>
               </main>
            </div>
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
                  Cool name, huh?
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
