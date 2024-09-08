// "use server"

// import { PrismaClient } from "@prisma/client"

// const prisma = new PrismaClient()

// export default async function isVerified(id) {
//     try {
//         const doc = 
    
//         return {
//         success: true,
//         verified: verified.map(doc => ({
//             id: doc.id,
//             name: doc.name,
//             issueDate: doc.issuedAt.toISOString(),
//             status: doc.verifier ? 'Verified' : 'Pending',
//             ownerAddress: doc.owner.walletAddress,
//             verifierAddress: doc.verifier?.user.walletAddress || 'Not assigned',
//         })),
//         }
//     } catch (error) {
//         console.error("Error fetching verified documents:", error)
//         return { success: false, message: "Error fetching verified documents" }
//     }
// }