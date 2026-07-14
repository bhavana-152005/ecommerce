import java.security.MessageDigest;

public class PasswordUtil {
    public static String hashPassword(String password) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = messageDigest.digest(password.getBytes("UTF-8"));
            StringBuilder encryptedPassword = new StringBuilder();

            for (byte hashedByte : hashedBytes) {
                encryptedPassword.append(String.format("%02x", hashedByte));
            }

            return encryptedPassword.toString();
        } catch (Exception ex) {
            throw new RuntimeException("Password encryption failed.");
        }
    }
}
