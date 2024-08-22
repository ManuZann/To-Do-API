import { User } from "./user.inteface";

export interface todo{
    id: number,
    title: string,
    description: string,
    user: User
}