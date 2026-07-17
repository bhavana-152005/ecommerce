# Bellevouix SQL Integration Guide

This project has three parts:

- `frontend/` has the HTML, CSS, and JavaScript screens.
- `java/ECommerceProject/` has the Java application logic.
- `sql/` has the MySQL database structure and reusable queries.

## 1. Create The Database

Recommended from the project root:

```powershell
.\setup_mysql_database.ps1 -User root
```

If `mysql.exe` is not on your PATH, pass the installed path:

```powershell
.\setup_mysql_database.ps1 -MysqlExe "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -User root
```

You can also run the SQL manually:

```powershell
mysql -u root -p < sql/bellevouix_database.sql
```

After it runs, MySQL should print:

```text
Bellevouix database is ready
```

It will also show how many users, products, orders, and reviews were loaded.

## 2. Database Name

Use this database in Java:

```text
bellevouix_store
```

JDBC connection URL:

```text
jdbc:mysql://localhost:3306/bellevouix_store
```

## 3. Tables And What They Mean

`users`
Stores signup/login accounts. Admins and customers are separated by the `role` column.

`products`
Stores product cards shown on women, men, kids, and accessories pages.

`product_sizes`
Stores sizes for products. One product can have many sizes.

`carts` and `cart_items`
Stores a user's active cart before checkout.

`orders` and `order_items`
Stores completed checkout history. Product name and price are copied here so old orders stay correct if product prices change later.

`order_addresses`
Stores the delivery address for each order.

`payments`
Stores payment method and payment status. For card payments, store only the last four digits.

`reviews`
Stores product ratings and review text.

`admin_activity`
Stores recent admin dashboard activity.

## 4. Java Query Files

Use these files as prepared-statement templates in Java:

- `sql/user_queries.sql`
- `sql/product_queries.sql`
- `sql/cart_queries.sql`
- `sql/order_queries.sql`
- `sql/admin_queries.sql`
- `sql/reviews_queries.sql`

The `?` symbols are placeholders. In Java, fill them with `PreparedStatement`.

Example:

```java
String sql = "SELECT product_id, name, category, price FROM products WHERE category = ? AND is_active = TRUE";
PreparedStatement statement = connection.prepareStatement(sql);
statement.setString(1, "women");
ResultSet result = statement.executeQuery();
```

## 5. Run The Full-Stack App

The project now includes a Java HTTP API in:

```text
java/ECommerceProject/ApiServer.java
```

To run with the MySQL database connected, first download/install MySQL Connector/J, then start from the project root:

```powershell
.\run_api.ps1 -ConnectorJar "C:\path\to\mysql-connector-j-8.x.x.jar" -MysqlUser root -MysqlPassword "your_mysql_password" -RequireDatabase
```

`-RequireDatabase` makes startup fail loudly if MySQL is not reachable. For frontend-only testing, leave it off and the API will fall back to demo memory data.

If port `8080` is already in use, pass another port:

```powershell
.\run_api.ps1 -ConnectorJar "C:\path\to\mysql-connector-j-8.x.x.jar" -MysqlUser root -MysqlPassword "your_mysql_password" -Port 8081 -RequireDatabase
```

You can still compile and run manually:

```powershell
cd java\ECommerceProject
javac *.java
java ApiServer
```

Open the frontend through the Java server:

```text
http://localhost:8080/html/login.html
```

Useful API checks:

```text
GET  http://localhost:8080/api/health
GET  http://localhost:8080/api/products
POST http://localhost:8080/api/login
POST http://localhost:8080/api/signup
POST http://localhost:8080/api/orders
```

## 6. MySQL JDBC Setup

`ApiServer.java` uses JDBC when MySQL Connector/J is available. If the driver is missing, the API still runs with memory fallback so the frontend can be tested.

The easiest startup command is:

```powershell
.\run_api.ps1 -ConnectorJar "C:\path\to\mysql-connector-j-8.x.x.jar" -MysqlUser root -MysqlPassword "your_mysql_password" -RequireDatabase
```

Or add the Connector/J jar to the classpath manually:

```powershell
java -cp ".;C:\path\to\mysql-connector-j.jar" ApiServer
```

Optional environment variables:

```powershell
$env:MYSQL_URL="jdbc:mysql://localhost:3306/bellevouix_store"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="your_mysql_password"
```

Then restart the API. `/api/health` should show a connected MySQL status similar to:

```json
{"ok":true,"database":"mysql connected (root@jdbc:mysql://localhost:3306/bellevouix_store)"}
```

If the status starts with `memory fallback`, the response now includes the JDBC error reason, usually one of these:

- `ClassNotFoundException`: Connector/J is missing from the Java classpath.
- `CommunicationsException`: MySQL Server is not running or the URL/port is wrong.
- `SQLException`: username, password, permissions, or database setup needs checking.

## 7. What Is Connected Now

- Login and signup call the Java backend first.
- Homepage product cards load from `/api/products`.
- Checkout sends completed orders to `/api/orders`.
- Java uses MySQL tables when JDBC is configured.
- Java falls back to demo memory data when MySQL is unavailable, so the UI remains testable.
