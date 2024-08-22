import bcrypt from "bcrypt"

const SALT_ROUNDS: number = 10

export const hashPassword = async(password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = async(hashedPassword: string, password: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword)
}