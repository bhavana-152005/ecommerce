import java.text.DecimalFormat;
import java.util.ArrayList;

public class Cart {
    private ArrayList<Product> items;

    public Cart() {
        items = new ArrayList<Product>();
    }

    public void addToCart(Product product) throws InvalidInputException {
        if (product == null) {
            throw new InvalidInputException("Cannot add an invalid product to cart.");
        }

        items.add(product);
        System.out.println(product.getName() + " added to cart.");
    }

    public void showCart() {
        DecimalFormat df = new DecimalFormat("0.00");

        System.out.println("\nMY CART");

        if (items.isEmpty()) {
            System.out.println("Your cart is empty.");
            return;
        }

        for (Product product : items) {
            System.out.println(product.getId() + " | " + product.getName()
                    + " | " + product.getCategory()
                    + " | Rs. " + df.format(product.getPrice()));
        }

        System.out.println("Total: Rs. " + df.format(calculateTotal()));
    }

    public void displayCart() {
        showCart();
    }

    public double calculateTotal() {
        double total = 0;

        // Each cart item is added to the final bill one by one.
        for (Product product : items) {
            total = total + product.getPrice();
        }

        return total;
    }

    public boolean isEmpty() {
        return items.isEmpty();
    }

    public void clearCart() {
        items.clear();
    }

    public void clear() {
        clearCart();
    }

    public ArrayList<Product> getItems() {
        return items;
    }
}
