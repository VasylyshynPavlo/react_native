export interface ICategory {
    id: number
    name: string
    image: string
    description: string
    userId: number
}

export interface ICreateCategory {
    name: string
    image: File | null
    description: string
}

export interface IEditCategory {
    id: number
    name: string
    image: File | null
    description: string
}