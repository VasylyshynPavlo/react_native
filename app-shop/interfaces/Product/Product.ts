export interface IProduct {
    id: number
    name: string
    description?: string
    price: number
    categoryId: number
    categoryName?: string
    imageUrls: string[]
}

export interface ICreateProduct {
    name: string
    description?: string
    price: number
    categoryId: number
    images: File[]
}

export interface IEditProduct extends ICreateProduct {
    id: number
}
