import prisma from '@/utils/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { email, organizationName, walletAddress } = req.body

    // Check if verifier already exists
    const existingVerifier = await prisma.user.findUnique({ where: { email } })
    if (existingVerifier) {
      return res.status(400).json({ message: 'Verifier already exists' })
    }

    // Create new verifier in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const newUser = await prisma.user.create({
        data: {
          email,
          walletAddress,
          role: 'VERIFYING_AUTHORITY'
        }
      })

      const newVerifier = await prisma.verifier.create({
        data: {
          userId: newUser.id,
          organizationName
        }
      })

      return { user: newUser, verifier: newVerifier }
    })

    res.status(201).json({ message: 'Verifier registered successfully', userId: result.user.id, verifierId: result.verifier.id })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
