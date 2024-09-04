import prisma from '@/utils/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { email, organizationName, walletAddress } = req.body

    // Check if issuer already exists
    const existingIssuer = await prisma.user.findUnique({ where: { email } })
    if (existingIssuer) {
      return res.status(400).json({ message: 'Issuer already exists' })
    }

    // Create new issuer in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          walletAddress,
          role: 'ISSUING_AUTHORITY'
        }
      })

      const newIssuer = await prisma.issuer.create({
        data: {
          userId: newUser.id,
          organizationName
        }
      })

      return { user: newUser, issuer: newIssuer }
    })

    res.status(201).json({ message: 'Issuer registered successfully', userId: result.user.id, issuerId: result.issuer.id })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
