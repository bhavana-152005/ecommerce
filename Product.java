import java.text.DecimalFormat;

public class Product {
    private int id;
    private String name;
    private String category;
    private double price;

    public Product(int id, String name, String category, double price) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public void displayProduct() {
        DecimalFormat df = new DecimalFormat("0.00");
        System.out.printf("%-5d %-24s %-14s Rs. %8s%n",
                id, name, category, df.format(price));
    }
}
