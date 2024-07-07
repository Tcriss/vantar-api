import { ProductList } from "../../../products/domain/entities/product-list.entity";

export function productListCreation(products: Partial<ProductList>[], subtotal: number): { list: ProductList[], subtotal: number } {
    let inventorySubtotal: number = subtotal;
        const productList = products.map(product => {
            const newProduct = {
                unit_price: product.unit_price,
                amount: product.amount,
                name: product.name,
                total: product.unit_price * product.amount
            };

            inventorySubtotal += newProduct.total
            return newProduct;
        });

        return {
            list: productList,
            subtotal: inventorySubtotal
        };
};