import prisma from "../models/prismaModel"
import { Request, Response } from "express"


export const createTodo = async (req: Request, res: Response) => {
    const { title, description }= req.body

    if(!title || !description) return res.status(400).json({ error: "The title and description is required"})

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized, user ID is missing." });
    }
    try {
        const todo = await prisma.todo.create({
            data: {
                title,
                description,
                userId: req.user?.id
            }
        })

        res.status(201).json(todo)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' })
    }
}

export const updateTodo = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    const { title, description }= req.body

    if(!title || !description) return res.status(400).json({ error: "Title and Description is required!"})
    
        try {
            const todo = await prisma.todo.findUnique({ where: { id }})
            if(!todo) return res.status(404).json({ error: "ToDo not found."})
            if(todo.userId !== req.user?.id) return res.status(403).json({ message: "Forbidden" })
            
            const newTodo = await prisma.todo.update({
                where: {
                    id
                },
                data: {
                    title,
                    description
                }
            })
            
            const {userId, ...todoReturn} = newTodo
            res.status(200).json(todoReturn)
        } catch (error) {
            res.status(500).json({ error: "Internal server error." })
        }
}

export const deleteTodo = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id)

    try {
        const todo = await prisma.todo.findUnique({ where: { id }})
        if(!todo) return res.status(404).json({ error: "ToDo not found."})
        if(todo.userId !== req.user?.id) return res.status(403).json({ message: "Forbidden" })
        
        const todoDeleted = await prisma.todo.delete({ where: { id } })

        res.status(204).json(todoDeleted)
    } catch (error) {
        res.status(500).json({ error: "Internal server error." })
    }
}

export const getTodos = async ( req: Request, res: Response ) => {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    try {
        const todos = await prisma.todo.findMany({
            select: {
                id: true,
                title: true,
                description: true,
                userId: false
            },
            take: limit,
            skip: (page - 1) * limit
        })

        if(!todos) return res.status(404).json({ message: "ToDos not founded."})
        const totalTodos = await prisma.todo.count()
        res.status(200).json({
            todos,
            total: totalTodos,
            page,
            limit
        })
    } catch (error) {
        res.status(400).json({ error })
    }
}