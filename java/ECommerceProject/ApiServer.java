import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.URLDecoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.Duration;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ApiServer {
    private static final int PORT = intEnv("API_PORT", 8080);
    private static final Path FRONTEND_ROOT = resolveFrontendRoot();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
    private static final ProductRepository productRepository = new ProductRepository();
    private static final UserRepository userRepository = new UserRepository();
    private static final OrderRepository orderRepository = new OrderRepository();

    public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);

        server.createContext("/api/health", exchange -> json(exchange, 200,
                "{\"ok\":true,\"database\":\"" + escape(Database.status()) + "\"}"));
        server.createContext("/api/products", ApiServer::products);
        server.createContext("/api/login", ApiServer::login);
        server.createContext("/api/signup", ApiServer::signup);
        server.createContext("/api/orders", ApiServer::orders);
        server.createContext("/api/seirraa", ApiServer::seirraa);
        server.createContext("/", ApiServer::staticFiles);

        server.setExecutor(null);
        server.start();

        System.out.println("Bellevouix API running at http://localhost:" + PORT);
        System.out.println("Open http://localhost:" + PORT + "/html/login.html");
        System.out.println("Database mode: " + Database.status());
    }

    private static Path resolveFrontendRoot() {
        Path[] candidates = {
                Path.of("frontend").toAbsolutePath().normalize(),
                Path.of("..", "frontend").toAbsolutePath().normalize(),
                Path.of("..", "..", "frontend").toAbsolutePath().normalize(),
                Path.of("..", "..", "..", "frontend").toAbsolutePath().normalize()
        };

        for (Path candidate : candidates) {
            if (Files.isDirectory(candidate)) {
                return candidate;
            }
        }

        return Path.of("frontend").toAbsolutePath().normalize();
    }

    private static void products(HttpExchange exchange) throws IOException {
        if (!"GET".equals(exchange.getRequestMethod())) {
            json(exchange, 405, error("Method not allowed"));
            return;
        }

        String category = queryParams(exchange).get("category");
        json(exchange, 200, "{\"products\":" + productRepository.findProducts(category) + "}");
    }

    private static void login(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            json(exchange, 405, error("Method not allowed"));
            return;
        }

        String body = body(exchange);
        String username = JsonLite.value(body, "username");
        String password = JsonLite.value(body, "password");
        String role = JsonLite.value(body, "role");

        if (isBlank(username) || isBlank(password) || isBlank(role)) {
            json(exchange, 400, error("Username, password, and role are required."));
            return;
        }

        UserAccount user = userRepository.login(username, password, role);
        if (user == null) {
            json(exchange, 401, error("Invalid login details."));
            return;
        }

        json(exchange, 200, "{\"success\":true,\"user\":" + user.toJson() + "}");
    }

    private static void signup(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            json(exchange, 405, error("Method not allowed"));
            return;
        }

        String body = body(exchange);
        String username = JsonLite.value(body, "username");
        String email = JsonLite.value(body, "email");
        String password = JsonLite.value(body, "password");
        String role = JsonLite.value(body, "role");
        String adminCode = JsonLite.value(body, "adminCode");

        if (isBlank(username) || isBlank(email) || isBlank(password) || isBlank(role)) {
            json(exchange, 400, error("Username, email, password, and role are required."));
            return;
        }

        if ("admin".equalsIgnoreCase(role) && !"BELLEVOUIX2025".equals(adminCode)) {
            json(exchange, 403, error("Invalid admin registration code."));
            return;
        }

        UserAccount user = userRepository.signup(username, email, password, role);
        if (user == null) {
            json(exchange, 409, error("Username or email already exists."));
            return;
        }

        json(exchange, 201, "{\"success\":true,\"user\":" + user.toJson() + "}");
    }

    private static void orders(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            json(exchange, 405, error("Method not allowed"));
            return;
        }

        String body = body(exchange);
        String orderId = orderRepository.placeOrder(body);
        if (orderId == null) {
            json(exchange, 400, error("Order could not be saved. Check cart and checkout data."));
            return;
        }

        json(exchange, 201, "{\"success\":true,\"orderId\":\"" + escape(orderId) + "\"}");
    }

    private static void seirraa(HttpExchange exchange) throws IOException {
        if (!"POST".equals(exchange.getRequestMethod())) {
            json(exchange, 405, error("Method not allowed"));
            return;
        }

        String body = body(exchange);
        String message = JsonLite.value(body, "message");
        String imageData = JsonLite.value(body, "imageData");
        String imageMimeType = JsonLite.value(body, "imageMimeType");
        if (isBlank(message) && isBlank(imageData)) {
            json(exchange, 400, error("A message or image is required."));
            return;
        }

        String reply = generateSeirraaReply(message, imageData, imageMimeType);
        if (isBlank(reply)) {
            json(exchange, 503, error("Seirraa is unavailable right now. Check your LLM credentials or try again shortly."));
            return;
        }

        json(exchange, 200, "{\"success\":true,\"reply\":\"" + escape(reply) + "\"}");
    }

    private static String generateSeirraaReply(String message, String imageData, String imageMimeType) {
        String provider = env("SEIRRAA_LLM_PROVIDER", "openai").trim().toLowerCase(Locale.ROOT);
        if ("local".equals(provider)) {
            return SeirraaModel.generateReply(message, imageData, imageMimeType);
        }

        String apiKey = firstNonBlank(
                env("SEIRRAA_API_KEY", ""),
                provider.equals("openai") ? env("OPENAI_API_KEY", "") : env("GEMINI_API_KEY", "")
        );

        if (isBlank(apiKey)) {
            return SeirraaModel.generateReply(message, imageData, imageMimeType);
        }

        try {
            String reply;
            if ("openai".equals(provider)) {
                reply = callOpenAi(apiKey, message, imageData, imageMimeType);
            } else {
                reply = callGemini(apiKey, message);
            }
            return isBlank(reply) ? SeirraaModel.generateReply(message, imageData, imageMimeType) : reply;
        } catch (Exception ex) {
            return SeirraaModel.generateReply(message, imageData, imageMimeType);
        }
    }

    private static String callOpenAi(String apiKey, String message, String imageData, String imageMimeType) throws Exception {
        String model = env("SEIRRAA_MODEL", "gpt-4.1-mini");
        StringBuilder payload = new StringBuilder("{\"model\":\"").append(escape(model)).append("\",\"temperature\":0.8,\"messages\":[{\"role\":\"system\",\"content\":\"You are Seirraa, a precise fashion intelligence assistant for Bellevouix. Analyze photos and text with color theory, undertone, season, contrast, body silhouette, and wardrobe fit. Provide a polished report with 4 sections: 1) Color analysis, 2) Styling advice, 3) What to wear and avoid, 4) One practical shopping recommendation. Keep it concise but useful.\"},{\"role\":\"user\",\"content\":[");

        if (!isBlank(imageData)) {
            String normalizedImage = imageData;
            if (!normalizedImage.startsWith("data:")) {
                normalizedImage = "data:" + (isBlank(imageMimeType) ? "image/jpeg" : imageMimeType) + ";base64," + normalizedImage;
            }
            payload.append("{\"type\":\"text\",\"text\":\"Analyze this outfit or appearance photo with expert color theory. User note: " + escape(message) + "\"},{\"type\":\"image_url\",\"image_url\":{\"url\":\"" + escape(normalizedImage) + "\"}}");
        } else {
            payload.append("{\"type\":\"text\",\"text\":\"" + escape(message) + "\"}");
        }

        payload.append("]}]}" );

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(25))
                .POST(HttpRequest.BodyPublishers.ofString(payload.toString()))
                .build();

        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            return "";
        }

        Matcher matcher = Pattern.compile("\\\"text\\\"\\s*:\\s*\\\"((?:\\\\.|[^\\\"])*)\\\"").matcher(response.body());
        return matcher.find() ? unescapeJson(matcher.group(1)) : "";
    }

    private static String callGemini(String apiKey, String message) throws Exception {
        String payload = "{\"contents\":[{\"parts\":[{\"text\":\"You are Seirraa, a fashion assistant for Bellevouix. Give concise, stylish advice with color theory and outfit suggestions. User request: " + escape(message) + "\"}]}]}";
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey))
                .header("Content-Type", "application/json")
                .timeout(Duration.ofSeconds(20))
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();

        HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() >= 400) {
            return "";
        }

        Matcher matcher = Pattern.compile("\\\"text\\\"\\s*:\\s*\\\"((?:\\\\.|[^\\\"])*)\\\"").matcher(response.body());
        return matcher.find() ? unescapeJson(matcher.group(1)) : "";
    }

    private static void staticFiles(HttpExchange exchange) throws IOException {
        if ("/".equals(exchange.getRequestURI().getPath())) {
            redirect(exchange, "/html/login.html");
            return;
        }

        Path requested = FRONTEND_ROOT.resolve(exchange.getRequestURI().getPath().substring(1)).normalize();
        Path allowedRoot = FRONTEND_ROOT.toAbsolutePath().normalize();
        Path absoluteRequested = requested.toAbsolutePath().normalize();

        if (!absoluteRequested.startsWith(allowedRoot) || !Files.exists(absoluteRequested) || Files.isDirectory(absoluteRequested)) {
            text(exchange, 404, "Not found");
            return;
        }

        byte[] bytes = Files.readAllBytes(absoluteRequested);
        exchange.getResponseHeaders().set("Content-Type", contentType(absoluteRequested));
        exchange.sendResponseHeaders(200, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void json(HttpExchange exchange, int status, String payload) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

        if ("OPTIONS".equals(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void text(HttpExchange exchange, int status, String payload) throws IOException {
        byte[] bytes = payload.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "text/plain; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static void redirect(HttpExchange exchange, String location) throws IOException {
        exchange.getResponseHeaders().set("Location", location);
        exchange.sendResponseHeaders(302, -1);
    }

    private static String body(HttpExchange exchange) throws IOException {
        return new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
    }

    private static Map<String, String> queryParams(HttpExchange exchange) {
        Map<String, String> result = new LinkedHashMap<>();
        String query = exchange.getRequestURI().getQuery();
        if (query == null || query.isBlank()) return result;

        for (String pair : query.split("&")) {
            String[] parts = pair.split("=", 2);
            String key = decode(parts[0]);
            String value = parts.length > 1 ? decode(parts[1]) : "";
            result.put(key, value);
        }
        return result;
    }

    private static String decode(String value) {
        return URLDecoder.decode(value, StandardCharsets.UTF_8);
    }

    private static String contentType(Path path) {
        String name = path.getFileName().toString().toLowerCase(Locale.ROOT);
        if (name.endsWith(".html")) return "text/html; charset=utf-8";
        if (name.endsWith(".css")) return "text/css; charset=utf-8";
        if (name.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (name.endsWith(".png")) return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        return "application/octet-stream";
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static String error(String message) {
        return "{\"success\":false,\"message\":\"" + escape(message) + "\"}";
    }

    private static String firstNonBlank(String... values) {
        for (String value : values) {
            if (!isBlank(value)) {
                return value;
            }
        }
        return "";
    }

    private static String escape(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\r", "").replace("\n", "\\n");
    }

    private static String unescapeJson(String value) {
        if (value == null) return "";
        return value.replace("\\\"", "\"").replace("\\\\", "\\").replace("\\n", "\n");
    }

    private static String env(String key, String fallback) {
        String value = System.getenv(key);
        return value == null || value.isBlank() ? fallback : value;
    }

    private static int intEnv(String key, int fallback) {
        String value = System.getenv(key);
        if (value == null || value.isBlank()) return fallback;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return fallback;
        }
    }

    private static final class Database {
        private static boolean checked;
        private static boolean available;
        private static String status = "not checked";
        private static String lastError = "";

        static Connection connection() throws Exception {
            if (!checked) check();
            if (!available) throw new IllegalStateException(status);
            return DriverManager.getConnection(url(), user(), password());
        }

        static String status() {
            if (!checked) check();
            return status;
        }

        private static void check() {
            checked = true;
            try {
                Class.forName("com.mysql.cj.jdbc.Driver");
                try (Connection ignored = DriverManager.getConnection(url(), user(), password())) {
                    available = true;
                    lastError = "";
                    status = "mysql connected (" + user() + "@" + url() + ")";
                }
            } catch (Exception ex) {
                available = false;
                lastError = ex.getClass().getSimpleName() + ": " + ex.getMessage();
                status = "memory fallback (" + lastError + ")";
                if ("true".equalsIgnoreCase(env("MYSQL_REQUIRED", "false"))) {
                    throw new IllegalStateException("MySQL connection is required but unavailable: " + lastError, ex);
                }
            }
        }

        private static String url() {
            return env("MYSQL_URL", "jdbc:mysql://localhost:3306/bellevouix_store");
        }

        private static String user() {
            return env("MYSQL_USER", "root");
        }

        private static String password() {
            return env("MYSQL_PASSWORD", "");
        }

        private static String env(String key, String fallback) {
            String value = System.getenv(key);
            return value == null || value.isBlank() ? fallback : value;
        }
    }

    private static final class UserAccount {
        final long id;
        final String username;
        final String email;
        final String role;

        UserAccount(long id, String username, String email, String role) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
        }

        String toJson() {
            return "{\"id\":" + id
                    + ",\"username\":\"" + escape(username)
                    + "\",\"email\":\"" + escape(email)
                    + "\",\"role\":\"" + escape(role) + "\"}";
        }
    }

    private static final class UserRepository {
        private final List<UserAccount> memoryUsers = new ArrayList<>();

        UserRepository() {
            memoryUsers.add(new UserAccount(1, "admin", "admin@bellevouix.com", "admin"));
            memoryUsers.add(new UserAccount(2, "sarah", "sarah@example.com", "user"));
        }

        UserAccount login(String usernameOrEmail, String password, String role) {
            String hash = PasswordUtil.hashPassword(password);

            try (Connection connection = Database.connection();
                 PreparedStatement statement = connection.prepareStatement(
                         "SELECT user_id, username, email, role FROM users "
                                 + "WHERE (username = ? OR email = ?) AND password_hash = ? AND role = ? AND is_active = TRUE")) {
                statement.setString(1, usernameOrEmail);
                statement.setString(2, usernameOrEmail);
                statement.setString(3, hash);
                statement.setString(4, role.toLowerCase(Locale.ROOT));

                try (ResultSet rs = statement.executeQuery()) {
                    if (rs.next()) {
                        return new UserAccount(rs.getLong("user_id"), rs.getString("username"),
                                rs.getString("email"), rs.getString("role"));
                    }
                }
            } catch (Exception ignored) {
                // Fall through to demo users when JDBC is unavailable.
            }

            if ("admin".equalsIgnoreCase(role) && "admin".equalsIgnoreCase(usernameOrEmail) && "admin123".equals(password)) {
                return memoryUsers.get(0);
            }
            if ("user".equalsIgnoreCase(role) && "sarah".equalsIgnoreCase(usernameOrEmail) && "user123".equals(password)) {
                return memoryUsers.get(1);
            }
            return null;
        }

        UserAccount signup(String username, String email, String password, String role) {
            String normalizedRole = role.toLowerCase(Locale.ROOT);
            String hash = PasswordUtil.hashPassword(password);

            try (Connection connection = Database.connection();
                 PreparedStatement statement = connection.prepareStatement(
                         "INSERT INTO users (username, full_name, email, password_hash, role, verification_status) "
                                 + "VALUES (?, ?, ?, ?, ?, ?)",
                         Statement.RETURN_GENERATED_KEYS)) {
                statement.setString(1, username);
                statement.setString(2, username);
                statement.setString(3, email);
                statement.setString(4, hash);
                statement.setString(5, normalizedRole);
                statement.setString(6, "admin".equals(normalizedRole) ? "verified" : "pending");
                statement.executeUpdate();

                try (ResultSet keys = statement.getGeneratedKeys()) {
                    long id = keys.next() ? keys.getLong(1) : System.currentTimeMillis();
                    return new UserAccount(id, username, email, normalizedRole);
                }
            } catch (Exception ignored) {
                for (UserAccount user : memoryUsers) {
                    if (user.username.equalsIgnoreCase(username) || user.email.equalsIgnoreCase(email)) return null;
                }
                UserAccount user = new UserAccount(System.currentTimeMillis(), username, email, normalizedRole);
                memoryUsers.add(user);
                return user;
            }
        }
    }

    private static final class ProductRepository {
        String findProducts(String category) {
            try (Connection connection = Database.connection();
                 PreparedStatement statement = connection.prepareStatement(productSql(category))) {
                if (!isBlank(category) && !"all".equalsIgnoreCase(category)) {
                    statement.setString(1, category.toLowerCase(Locale.ROOT));
                }

                try (ResultSet rs = statement.executeQuery()) {
                    StringBuilder json = new StringBuilder("[");
                    boolean first = true;
                    while (rs.next()) {
                        if (!first) json.append(',');
                        first = false;
                        json.append(productJson(rs));
                    }
                    json.append(']');
                    return json.toString();
                }
            } catch (Exception ignored) {
                return fallbackProducts(category);
            }
        }

        private String productSql(String category) {
            String base = "SELECT p.product_id, p.name, p.brand, p.category, p.subcategory, p.price, "
                    + "p.original_price, p.discount_percent, p.stock_quantity, p.image_url, p.rating, "
                    + "p.rating_count, p.is_new, GROUP_CONCAT(ps.size_label ORDER BY ps.size_label) AS sizes "
                    + "FROM products p LEFT JOIN product_sizes ps ON p.product_id = ps.product_id "
                    + "WHERE p.is_active = TRUE";
            if (!isBlank(category) && !"all".equalsIgnoreCase(category)) base += " AND p.category = ?";
            return base + " GROUP BY p.product_id ORDER BY p.created_at DESC, p.product_id";
        }

        private String productJson(ResultSet rs) throws Exception {
            return "{\"id\":" + rs.getLong("product_id")
                    + ",\"name\":\"" + escape(rs.getString("name"))
                    + "\",\"brand\":\"" + escape(rs.getString("brand"))
                    + "\",\"category\":\"" + escape(rs.getString("category"))
                    + "\",\"subcategory\":\"" + escape(rs.getString("subcategory"))
                    + "\",\"price\":" + rs.getBigDecimal("price")
                    + ",\"originalPrice\":" + numberOrNull(rs.getBigDecimal("original_price"))
                    + ",\"discount\":" + rs.getInt("discount_percent")
                    + ",\"stock\":" + rs.getInt("stock_quantity")
                    + ",\"image\":\"" + escape(rs.getString("image_url"))
                    + "\",\"rating\":" + rs.getBigDecimal("rating")
                    + ",\"ratingCount\":" + rs.getInt("rating_count")
                    + ",\"isNew\":" + rs.getBoolean("is_new")
                    + ",\"sizes\":" + sizesJson(rs.getString("sizes")) + "}";
        }

        private String fallbackProducts(String category) {
            String all = "["
                    + "{\"id\":101,\"name\":\"Women Kurti\",\"brand\":\"Bellevouix\",\"category\":\"women\",\"subcategory\":\"kurtis\",\"price\":1499,\"originalPrice\":1999,\"discount\":25,\"stock\":35,\"image\":\"../images/bellevouix-logo.png\",\"rating\":4.4,\"ratingCount\":120,\"isNew\":true,\"sizes\":[\"S\",\"M\",\"L\",\"XL\"]},"
                    + "{\"id\":102,\"name\":\"Floral Dress\",\"brand\":\"Bellevouix\",\"category\":\"women\",\"subcategory\":\"dresses\",\"price\":2299,\"originalPrice\":2999,\"discount\":23,\"stock\":28,\"image\":\"https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop\",\"rating\":4.7,\"ratingCount\":342,\"isNew\":true,\"sizes\":[\"S\",\"M\",\"L\"]},"
                    + "{\"id\":201,\"name\":\"Men Hoodie\",\"brand\":\"Bellevouix\",\"category\":\"men\",\"subcategory\":\"hoodies\",\"price\":1899,\"originalPrice\":2499,\"discount\":24,\"stock\":42,\"image\":\"../images/bellevouix-logo.png\",\"rating\":4.5,\"ratingCount\":155,\"isNew\":false,\"sizes\":[\"M\",\"L\",\"XL\"]},"
                    + "{\"id\":202,\"name\":\"Classic Denim Jacket\",\"brand\":\"UrbanStyle\",\"category\":\"men\",\"subcategory\":\"jackets\",\"price\":2799,\"originalPrice\":3999,\"discount\":30,\"stock\":30,\"image\":\"https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop\",\"rating\":4.6,\"ratingCount\":189,\"isNew\":false,\"sizes\":[\"M\",\"L\",\"XL\"]},"
                    + "{\"id\":301,\"name\":\"Kids T-Shirt\",\"brand\":\"KiddoWear\",\"category\":\"kids\",\"subcategory\":\"tshirts\",\"price\":699,\"originalPrice\":999,\"discount\":30,\"stock\":60,\"image\":\"https://images.unsplash.com/photo-1503919436084-b69c2f762761?w=400&h=500&fit=crop\",\"rating\":4.7,\"ratingCount\":324,\"isNew\":true,\"sizes\":[\"S\",\"M\",\"L\"]},"
                    + "{\"id\":401,\"name\":\"Luxury Handbag\",\"brand\":\"Bellevouix\",\"category\":\"accessories\",\"subcategory\":\"bags\",\"price\":3499,\"originalPrice\":4999,\"discount\":30,\"stock\":18,\"image\":\"../images/bellevouix-logo.png\",\"rating\":4.8,\"ratingCount\":210,\"isNew\":true,\"sizes\":[]}"
                    + "]";
            if (isBlank(category) || "all".equalsIgnoreCase(category)) return all;
            return all.replaceAll("\\{(?!(?=[^}]*\"category\":\"" + Pattern.quote(category.toLowerCase(Locale.ROOT)) + "\")).*?\\},?", "");
        }

        private String numberOrNull(BigDecimal value) {
            return value == null ? "null" : value.toString();
        }

        private String sizesJson(String csv) {
            if (csv == null || csv.isBlank()) return "[]";
            StringBuilder json = new StringBuilder("[");
            String[] sizes = csv.split(",");
            for (int i = 0; i < sizes.length; i++) {
                if (i > 0) json.append(',');
                json.append('"').append(escape(sizes[i])).append('"');
            }
            return json.append(']').toString();
        }
    }

    private static final class OrderRepository {
        String placeOrder(String body) {
            String generatedId = JsonLite.value(body, "orderId");
            String orderId = isBlank(generatedId) ? "BLV" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(Locale.ROOT) : generatedId;
            List<OrderItemPayload> items = JsonLite.items(body);
            if (items.isEmpty()) return null;

            try (Connection connection = Database.connection()) {
                connection.setAutoCommit(false);
                try {
                    saveOrder(connection, body, orderId);
                    saveItems(connection, orderId, items);
                    connection.commit();
                } catch (Exception ex) {
                    connection.rollback();
                    throw ex;
                }
            } catch (Exception ignored) {
                // In fallback mode the frontend still receives an order id and stores local order details.
            }
            return orderId;
        }

        private void saveOrder(Connection connection, String body, String orderId) throws Exception {
            BigDecimal subtotal = JsonLite.decimal(body, "subtotal");
            BigDecimal shipping = JsonLite.decimal(body, "shipping");
            BigDecimal tax = JsonLite.decimal(body, "tax");
            BigDecimal total = JsonLite.decimal(body, "total");
            String first = JsonLite.value(body, "firstName");
            String last = JsonLite.value(body, "lastName");
            String email = JsonLite.value(body, "email");
            String phone = JsonLite.value(body, "phone");
            String paymentMethod = JsonLite.value(body, "paymentMethod");

            try (PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, payment_method, "
                            + "subtotal, shipping_amount, tax_amount, total_amount, estimated_delivery) "
                            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")) {
                statement.setString(1, orderId);
                statement.setString(2, (first + " " + last).trim());
                statement.setString(3, email);
                statement.setString(4, phone);
                statement.setString(5, isBlank(paymentMethod) ? "cod" : paymentMethod);
                statement.setBigDecimal(6, subtotal);
                statement.setBigDecimal(7, shipping);
                statement.setBigDecimal(8, tax);
                statement.setBigDecimal(9, total);
                statement.setDate(10, Date.valueOf(LocalDate.now().plusDays(5)));
                statement.executeUpdate();
            }
        }

        private void saveItems(Connection connection, String orderId, List<OrderItemPayload> items) throws Exception {
            try (PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO order_items (order_id, product_id, product_name, product_category, size_label, quantity, unit_price, line_total) "
                            + "VALUES (?, ?, ?, ?, ?, ?, ?, ?)")) {
                for (OrderItemPayload item : items) {
                    statement.setString(1, orderId);
                    statement.setLong(2, item.id);
                    statement.setString(3, item.name);
                    statement.setString(4, item.category);
                    statement.setString(5, isBlank(item.size) ? "Free Size" : item.size);
                    statement.setInt(6, item.quantity);
                    statement.setBigDecimal(7, item.price);
                    statement.setBigDecimal(8, item.price.multiply(BigDecimal.valueOf(item.quantity)));
                    statement.addBatch();
                }
                statement.executeBatch();
            }
        }
    }

    private static final class OrderItemPayload {
        long id;
        String name;
        String category;
        String size;
        int quantity;
        BigDecimal price;
    }

    private static final class JsonLite {
        static String value(String json, String key) {
            Pattern pattern = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"((?:\\\\.|[^\"])*)\"");
            Matcher matcher = pattern.matcher(json);
            return matcher.find() ? matcher.group(1).replace("\\\"", "\"").replace("\\\\", "\\") : "";
        }

        static BigDecimal decimal(String json, String key) {
            Pattern pattern = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*([0-9]+(?:\\.[0-9]+)?)");
            Matcher matcher = pattern.matcher(json);
            return matcher.find() ? new BigDecimal(matcher.group(1)) : BigDecimal.ZERO;
        }

        static List<OrderItemPayload> items(String json) {
            List<OrderItemPayload> items = new ArrayList<>();
            Matcher arrayMatcher = Pattern.compile("\"items\"\\s*:\\s*\\[(.*?)]\\s*,\\s*\"totals\"", Pattern.DOTALL).matcher(json);
            if (!arrayMatcher.find()) return items;

            Matcher objectMatcher = Pattern.compile("\\{(.*?)\\}", Pattern.DOTALL).matcher(arrayMatcher.group(1));
            while (objectMatcher.find()) {
                String object = "{" + objectMatcher.group(1) + "}";
                OrderItemPayload item = new OrderItemPayload();
                item.id = decimal(object, "id").longValue();
                item.name = value(object, "name");
                item.category = value(object, "category");
                item.size = value(object, "selectedSize");
                item.quantity = decimal(object, "quantity").intValue();
                item.price = decimal(object, "price");
                if (item.id > 0 && !isBlank(item.name) && item.quantity > 0 && item.price.compareTo(BigDecimal.ZERO) > 0) {
                    items.add(item);
                }
            }
            return items;
        }
    }
}
