import java.util.ArrayList;

public class Store {
    private ArrayList<Product> products;

    public Store() {
        products = new ArrayList<>();
        preloadProducts();
    }

    private void preloadProducts() {
        // Sample products make the application ready for demo as soon as it starts.
        products.add(new Product(101, "Women Kurti", "Women", 1499.00));
        products.add(new Product(102, "Floral Dress", "Women", 2299.00));
        products.add(new Product(201, "Men Hoodie", "Men", 1899.00));
        products.add(new Product(202, "Classic Denim Jacket", "Men", 2799.00));
        products.add(new Product(301, "Kids T-Shirt", "Kids", 699.00));
        products.add(new Product(302, "Kids Sneakers", "Kids", 1299.00));
        products.add(new Product(401, "Luxury Handbag", "Accessories", 3499.00));
        products.add(new Product(402, "Sneakers", "Accessories", 2499.00));
        products.add(new Product(403, "Watches", "Accessories", 1999.00));
    }

    public void addProduct(Product product) {
        products.add(product);
    }

    public void removeProduct(int productId) throws InvalidInputException {
        Product product = getProductById(productId);

        if (product == null) {
            throw new InvalidInputException("Product ID not found.");
        }

        products.remove(product);
    }

    public Product getProductById(int productId) {
        // Linear search keeps the logic beginner-friendly and easy to debug.
        for (Product product : products) {
            if (product.getId() == productId) {
                return product;
            }
        }

        return null;
    }

    public void displayAllProducts() {
        System.out.println("\nBELLEVOIX INVENTORY");
        System.out.printf("%-5s %-24s %-14s %s%n", "ID", "Product", "Category", "Price");

        if (products.isEmpty()) {
            System.out.println("No products available.");
            return;
        }

        for (Product product : products) {
            product.displayProduct();
        }
    }

    public void displayProductsByCategory(String category) {
        boolean found = false;

        System.out.println("\n" + category.toUpperCase() + " COLLECTION");
        System.out.printf("%-5s %-24s %-14s %s%n", "ID", "Product", "Category", "Price");

        for (Product product : products) {
            if (product.getCategory().equalsIgnoreCase(category)) {
                product.displayProduct();
                found = true;
            }
        }

        if (!found) {
            System.out.println("No products found in this category.");
        }
    }

    public ArrayList<Product> getProducts() {
        return products;
    }
}
