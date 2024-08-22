import { Request, Response } from "express"
import { comparePassword, hashPassword } from "../services/hash.service"
import prisma from "../models/prismaModel"
import { generateToken } from "../services/token.service"

export const register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body

    try {
        const hashedPassword = await hashPassword(password)
        const user = await prisma.user.create({
            data:{
                name,
                email,
                password: hashedPassword
            }
        })

        const token = generateToken(user)
        res.status(201).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Failed to register user' })
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if(!user) {
            res.status(404).json({ error: "User/Password incorrect."})
            return
        }
        
        const passwordComparation = await comparePassword(user.password, password)
        if(!passwordComparation) { 
            res.status(401).json({ error: "User/Password incorrect."})
            return
        }
            
        const token = generateToken(user)
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Failed to login' })
    }
}