export interface User {
    id: number;
    email: string;
    name: string;
    role: number;
}
export interface Product {
    id: number;
    category_id: number;
    sale: number;
    name: string;
    thumb: string;
    price: number;
    description: string;
    product_content: string;
    is_show: boolean;
    options: {
        size: [
            {
                op: string;
                price: number;
            }
        ];
    };
    has_option: boolean;
    created_at: string;
    updated_at: string;
    delete_at: string;
}

export interface ProductCart {
    id: number;
    quantity: number;
    product_options: number;
    products: {
        name: string;
        id: number;
        thumb: string;
        price: number;
        options: {
            size: [
                {
                    op: string;
                    price: number;
                }
            ];
        };
    };
}

export interface Category {
    id: number;
    name: string;
    is_show: number;
    created_at: string;
    updated_at: string;
    img: string;
}

export interface Shop {
    id: number;
    address: string;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    shop_id: number;
    name: string;
    phone: string;
    address: string;
    totalprice: number;
    status: number;
    message: string;
    created_at: string;
    updated_at: string;
    code: string;
    order_items: [
        {
            id: number;
            order_id: number;
            product_id: number;
            quantity: number;
            price: number;
            product_options: {
                op: string;
                price: number;
            };
            created_at: string;
            updated_at: string;
            products: Product;
        }
    ];
}

export interface Blog {
    id: number;
    title: string;
    thumb: string;
    content: string;
    desc: string;
    type: number;
    created_at: string;
    updated_at: string;
}

export interface Slider {
    id: number;
    name: string;
    image: string;
    created_at: string;
    updated_at: string;
}

export interface Voucher {
    id: number;
    code: string;
    discount: number;
    type: string;
    start: string;
    end: string;
    created_at: string;
    updated_at: string;
}

export interface Chart {
    total: object;
    shop: {
        id: number;
        address: string;
        created_at: string;
        updated_at: string;
        month: number[];
    }[];
}
