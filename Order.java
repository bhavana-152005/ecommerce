import java.text.DecimalFormat;
import java.util.ArrayList;

public class Order {
    private String username;
    private ArrayList<Product> orderedProducts;
    private double totalAmount;

    public Order(String username, ArrayList<Product> cartItems, double totalAmount) {
        this.username = username;
        this.orderedProducts = new ArrayList<>(cartItems);
        this.totalAmount = totalAmount;
    }

    public void displayOrderSummary() {
        DecimalFormat df = new DecimalFormat("0.00");

        System.out.println("\nORDER SUMMARY");
        System.out.println("Customer: " + username);

        for (Product product : orderedProducts) {
            System.out.println(product.getName() + " - Rs. " + df.format(product.getPrice()));
        }

        System.out.println("Total Amount: Rs. " + df.format(totalAmount));
    }
}
