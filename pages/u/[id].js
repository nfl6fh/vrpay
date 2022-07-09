import styles from "../../styles/UserPage.module.css"
import { signIn, signOut, useSession } from "next-auth/react"
import { useEffect } from "react"
import Loading from "../../components/Loading";
import { prisma } from "../../lib/prisma.js";

export const getServerSideProps = async ({ params }) => {
    const user = await prisma.user.findUnique({
      where: {
        id: String(params?.id),
      },
    });

    console.log("id:", params?.id);
    console.log("user:", user);
  
    if (user.createdAt !== null) {
      user.createdAt = user.createdAt.toString();
    }
    if (user.updatedAt !== null) {
      user.updatedAt = user.updatedAt.toISOString();
    }
  
    return {
      props: user,
    };
};

export default function UserPage(props) {
   const { data: session, status } = useSession()
   
   if (status === "loading") {
      return <Loading />
   }

   function getGradYearFormatting(gy) {
      if (gy === null) {
         return "";
      }
      return "('" + gy.slice(gy.length - 2) + ")";
   }

   return (
      <div className={styles.container}>
        <div className={styles.header}>
        <div>
          <p className={styles.name}>{props.name}</p>
          <p className={styles.gradYear}>{getGradYearFormatting(props.grad_year)}</p>
         </div>
         <p>Total due: <span className={styles.totalDue}>${props.total_due}</span></p>
         </div>
         <p>Transactions:</p>
      </div>
   )
}
