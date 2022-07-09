import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { userInfo } from "os"
import Loading from "../components/Loading";
import Router from "next/router";
import { useEffect } from "react"

export default function Home() {
   const { data: session, status } = useSession()

   useEffect(() => {
      console.log("session:", session);
   }, [session])

   if (status === "loading") {
      return <Loading />;
   }

   if (session) {
      if (session.is_verified) {
         if (session.role && session.role !== "") {
            // redirect to dashboard/show dashboard
            return <>User is admin/treasurer</>
         } else {
            Router.push("/u/[id]", `/u/${session.uid}`)
            return (<></>)
         }
      } else {
         // pending page
         return <>Account pending. user is not verified</>
      }

      
   } else {
      // user is not logged in
      return (
         <div>
            <p>Homepage (Sign in page)</p>
            <button onClick={() => signIn("google")}>Sign in</button>
         </div>
      )
   }
}
