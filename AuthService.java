import java.util.ArrayList;
import java.util.Scanner;

public class AuthService {
    private ArrayList<User> users;

    public AuthService() {
        users = new ArrayList<>();
    }

    public User registerUser(Scanner scanner) {
        try {
            String username = Main.readRequiredText(scanner, "Create username: ");
            String password = Main.readPassword(scanner, "Create password: ");

            // Duplicate usernames are blocked before adding a new User to the ArrayList.
            if (findUserByUsername(username) != null) {
                throw new InvalidInputException("Username already exists. Try another one.");
            }

            // Store only the encrypted password, never the original plain text password.
            String encryptedPassword = PasswordUtil.hashPassword(password);
            User newUser = new User(username, encryptedPassword);
            users.add(newUser);
            System.out.println("Registration successful.");
            System.out.println("Please login to continue.");
            return newUser;
        } catch (InvalidInputException ex) {
            System.out.println("Registration Error: " + ex.getMessage());
        } catch (Exception ex) {
            System.out.println("Registration failed: " + ex.getMessage());
        }

        return null;
    }

    public User loginUser(Scanner scanner) {
        try {
            String username = Main.readRequiredText(scanner, "Username: ");
            String password = Main.readPassword(scanner, "Password: ");

            User user = findUserByUsername(username);

            if (user == null) {
                throw new InvalidInputException("User not found.");
            }

            // Login works by comparing two SHA-256 hashes.
            String encryptedPassword = PasswordUtil.hashPassword(password);

            if (!user.getEncryptedPassword().equals(encryptedPassword)) {
                throw new InvalidInputException("Incorrect password.");
            }

            System.out.println("Login successful.");
            System.out.println("Opening your user dashboard...");
            return user;
        } catch (InvalidInputException ex) {
            System.out.println("Login Error: " + ex.getMessage());
        } catch (Exception ex) {
            System.out.println("Login failed: " + ex.getMessage());
        }

        return null;
    }

    private User findUserByUsername(String username) {
        for (User user : users) {
            if (user.getUsername().equalsIgnoreCase(username)) {
                return user;
            }
        }

        return null;
    }

    public ArrayList<User> getUsers() {
        return users;
    }
}
