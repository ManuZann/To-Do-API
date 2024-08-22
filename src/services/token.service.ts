import Jwt from "jsonwebtoken"
import { User } from "../models/user.inteface"
import { Request, Response, NextFunction } from "express"
import prisma from "../models/prismaModel"

const JWT_SECRET = process.env.JWT_SECRET || "default"

export const generateToken = (user: User): string => {
    return Jwt.sign({ id: user.id , email: user.email }, JWT_SECRET, { expiresIn: "1h"})
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]

    if(!token) return res.status(401).json({ message: "Unauthorized" })
    
    try {
        const decoded = Jwt.verify(token, JWT_SECRET) as { id: number }
        const user = await prisma.user.findUnique({ where: { id: decoded.id }})
        if(!user) return res.status(404).json({ error: 'User not found.' })

        req.user = user
        next()
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' })
    }
}