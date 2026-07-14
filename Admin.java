import java.util.Scanner;

public class Admin {
    private static final String ADMIN_USERNAME = "admin";
    private static final String ADMIN_PASSWORD = "admin";

    public boolean login(String username, String password) {
        return ADMIN_USERNAME.equalsIgnoreCase(username) && ADMIN_PASSWORD.equals(password);
    }

    public void showAdminMenu(Scanner scanner, Store store) {
        boolean adminActive = true;

        while (adminActive) {
            System.out.println("\nADMIN DASHBOARD");
            System.out.println("1. View Inventory");
            System.out.println("2. Add Product");
            System.out.println("3. Remove Product");
            System.out.println("4. Logout");

            try {
                int choice = Main.readInt(scanner, "Choose an option: ");

                switch (choice) {
                    case 1:
                        store.displayAllProducts();
                        break;
                    case 2:
                        addNewProduct(scanner, store);
                        break;
                    case 3:
                        removeProduct(scanner, store);
                        break;
                    case 4:
                        adminActive = false;
                        System.out.println("Admin logged out successfully.");
                        break;
                    default:
                        throw new InvalidInputException("Please choose an option from 1 to 4.");
                }
            } catch (InvalidInputException ex) {
                System.out.println("Admin Error: " + ex.getMessage());
            } catch (Exception ex) {
                System.out.println("Unexpected admin error: " + ex.getMessage());
            } finally {
                System.out.println();
            }
        }
    }

    private void addNewProduct(Scanner scanner, Store store) throws InvalidInputException {
        int id = Main.readInt(scanner, "Product ID: ");
        Main.validatePositiveNumber(id, "Product ID");

        if (store.getProductById(id) != null) {
            throw new InvalidInputException("A product with this ID already exists.");
        }

        String name = Main.readRequiredText(scanner, "Product name: ");
        String category = Main.readRequiredText(scanner, "Category (Women/Men/Kids/Accessories): ");
        double price = Main.readDouble(scanner, "Price: ");

        if (price <= 0) {
            throw new InvalidInputException("Price must be greater than zero.");
        }

        Product newProduct = new Product(id, name, category, price);
        store.addProduct(newProduct);
        System.out.println("Product added successfully.");
    }

    private void removeProduct(Scanner scanner, Store store) throws InvalidInputException {
        int id = Main.readInt(scanner, "Enter product ID to remove: ");
        store.removeProduct(id);
        System.out.println("Product removed successfully.");
    }
}
