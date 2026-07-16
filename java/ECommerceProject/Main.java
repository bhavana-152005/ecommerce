import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    private static AuthService authService = new AuthService();
    private static Store store = new Store();
    private static Admin admin = new Admin();
    // Orders are kept in memory using ArrayList for a simple console project.
    private static ArrayList<Order> orders = new ArrayList<>();

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        while (running) {
            showWelcomeMenu();

            try {
                int choice = readInt(scanner, "Choose an option: ");

                switch (choice) {
                    case 1:
                        User registeredUser = authService.registerUser(scanner);
                        if (registeredUser != null) {
                            User userAfterRegistration = authService.loginUser(scanner);
                            if (userAfterRegistration != null) {
                                showUserMenu(scanner, userAfterRegistration);
                            }
                        }
                        break;
                    case 2:
                        User loggedInUser = authService.loginUser(scanner);
                        if (loggedInUser != null) {
                            showUserMenu(scanner, loggedInUser);
                        }
                        break;
                    case 3:
                        adminLogin(scanner);
                        break;
                    case 4:
                        running = false;
                        System.out.println("Thank you for visiting Bellevoix.");
                        break;
                    default:
                        throw new InvalidInputException("Please choose an option from 1 to 4.");
                }
            } catch (InputMismatchException ex) {
                System.out.println("Invalid input. Please enter numbers only.");
            } catch (InvalidInputException ex) {
                System.out.println("Input Error: " + ex.getMessage());
            } catch (Exception ex) {
                System.out.println("Something went wrong: " + ex.getMessage());
            } finally {
                System.out.println();
            }
        }

        scanner.close();
    }

    private static void showWelcomeMenu() {
        System.out.println("\nBELLEVOIX");
        System.out.println("1. Register User");
        System.out.println("2. User Login");
        System.out.println("3. Admin Login");
        System.out.println("4. Exit");
    }

    private static void showUserMenu(Scanner scanner, User user) {
        Cart cart = new Cart();
        boolean userActive = true;

        while (userActive) {
            System.out.println("\nBELLEVOIX USER MENU");
            System.out.println("Welcome, " + user.getUsername());
            System.out.println("Cart items: " + cart.getItems().size());
            System.out.println("1. Browse All Products");
            System.out.println("2. Browse Categories");
            System.out.println("3. Add Product to Cart");
            System.out.println("4. View Cart");
            System.out.println("5. Checkout");
            System.out.println("6. Logout");

            try {
                int choice = readInt(scanner, "Choose an option: ");

                switch (choice) {
                    case 1:
                        store.displayAllProducts();
                        break;
                    case 2:
                        browseCategories(scanner);
                        break;
                    case 3:
                        addProductToCart(scanner, cart);
                        afterAddingToCart(scanner, user, cart);
                        break;
                    case 4:
                        cart.showCart();
                        break;
                    case 5:
                        checkout(scanner, user, cart);
                        break;
                    case 6:
                        userActive = false;
                        System.out.println("Logged out successfully.");
                        break;
                    default:
                        throw new InvalidInputException("Please choose an option from 1 to 6.");
                }
            } catch (InputMismatchException ex) {
                System.out.println("Invalid input. Please enter numbers only.");
            } catch (InvalidInputException ex) {
                System.out.println("Input Error: " + ex.getMessage());
            } catch (Exception ex) {
                System.out.println("Something went wrong: " + ex.getMessage());
            } finally {
                System.out.println();
            }
        }
    }

    private static void adminLogin(Scanner scanner) {
        try {
            String username = readRequiredText(scanner, "Admin username: ");
            String password = readRequiredText(scanner, "Admin password: ");

            if (admin.login(username, password)) {
                System.out.println("Admin login successful.");
                System.out.println("Opening admin dashboard...");
                admin.showAdminMenu(scanner, store);
            } else {
                throw new InvalidInputException("Invalid admin credentials.");
            }
        } catch (InvalidInputException ex) {
            System.out.println("Admin Login Failed: " + ex.getMessage());
        }
    }

    private static void browseCategories(Scanner scanner) throws InvalidInputException {
        System.out.println("\nCategories");
        System.out.println("1. Women");
        System.out.println("2. Men");
        System.out.println("3. Kids");
        System.out.println("4. Accessories");

        int choice = readInt(scanner, "Choose category: ");
        String category;

        switch (choice) {
            case 1:
                category = "Women";
                break;
            case 2:
                category = "Men";
                break;
            case 3:
                category = "Kids";
                break;
            case 4:
                category = "Accessories";
                break;
            default:
                throw new InvalidInputException("Please choose a valid category.");
        }

        store.displayProductsByCategory(category);
    }

    private static void addProductToCart(Scanner scanner, Cart cart) throws InvalidInputException {
        store.displayAllProducts();
        int productId = readInt(scanner, "Enter product ID to add: ");
        Product product = store.getProductById(productId);

        if (product == null) {
            throw new InvalidInputException("No product found with ID " + productId + ".");
        }

        cart.addToCart(product);
    }

    private static void afterAddingToCart(Scanner scanner, User user, Cart cart) throws InvalidInputException {
        boolean choosing = true;

        while (choosing) {
            System.out.println("\nWhat would you like to do next?");
            System.out.println("1. View Cart");
            System.out.println("2. Checkout and Place Order");
            System.out.println("3. Continue Shopping");

            int choice = readInt(scanner, "Choose an option: ");

            switch (choice) {
                case 1:
                    cart.showCart();
                    choosing = false;
                    break;
                case 2:
                    checkout(scanner, user, cart);
                    choosing = false;
                    break;
                case 3:
                    choosing = false;
                    break;
                default:
                    System.out.println("Please choose 1, 2, or 3.");
            }
        }
    }

    private static void checkout(Scanner scanner, User user, Cart cart) throws InvalidInputException {
        if (cart.isEmpty()) {
            throw new InvalidInputException("Cart is empty. Add products before checkout.");
        }

        cart.showCart();
        String confirmation = readRequiredText(scanner, "Place this order? (yes/no): ");

        if (confirmation.equalsIgnoreCase("yes") || confirmation.equalsIgnoreCase("y")) {
            placeOrder(user, cart);
        } else {
            System.out.println("Checkout cancelled. Your cart is saved.");
        }
    }

    private static void placeOrder(User user, Cart cart) {
        Order order = new Order(user.getUsername(), cart.getItems(), cart.calculateTotal());
        orders.add(order);

        order.displayOrderSummary();
        cart.clearCart();
        System.out.println("Order placed successfully.");
    }

    public static int readInt(Scanner scanner, String message) {
        System.out.print(message);
        String input = scanner.nextLine().trim();

        try {
            return Integer.parseInt(input);
        } catch (NumberFormatException ex) {
            // Converted into InputMismatchException to show required exception handling.
            throw new InputMismatchException("Please enter a valid number.");
        }
    }

    public static double readDouble(Scanner scanner, String message) {
        System.out.print(message);
        String input = scanner.nextLine().trim();

        try {
            return Double.parseDouble(input);
        } catch (NumberFormatException ex) {
            throw new InputMismatchException("Please enter a valid decimal number.");
        }
    }

    public static String readRequiredText(Scanner scanner, String message) throws InvalidInputException {
        System.out.print(message);
        String input = scanner.nextLine().trim();

        if (input.isEmpty()) {
            throw new InvalidInputException("This field cannot be empty.");
        }

        return input;
    }

    public static String readPassword(Scanner scanner, String message) throws InvalidInputException {
        System.out.print("Hide password while typing? (yes/no or type password directly): ");
        String answer = scanner.nextLine().trim();
        String password;

        if (answer.equalsIgnoreCase("yes") || answer.equalsIgnoreCase("y")) {
            System.out.println("Hidden password is not supported in VS Code terminal.");
            password = readRequiredText(scanner, message);
        } else if (answer.equalsIgnoreCase("no") || answer.equalsIgnoreCase("n")) {
            password = readRequiredText(scanner, message);
        } else {
            password = answer;
        }

        if (password.isEmpty()) {
            throw new InvalidInputException("Password cannot be empty.");
        }

        return password;
    }

    public static void validatePositiveNumber(int number, String fieldName) throws InvalidInputException {
        if (number <= 0) {
            throw new InvalidInputException(fieldName + " must be greater than zero.");
        }
    }
}
