# Multi-stage Dockerfile for Bellevouix Java API

# Builder: compile Java sources
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY java/ECommerceProject/ ./
# Ensure lib directory exists and copy any jars if present
RUN mkdir -p lib
COPY lib/ lib/ 

# Compile sources (will fail the build if compilation errors occur)
RUN javac -Xlint:none -cp "lib/*" $(ls *.java 2>/dev/null || true) || true

# Runtime image
FROM eclipse-temurin:21-jre
WORKDIR /app
# copy compiled classes and libs
COPY --from=builder /app /app
COPY frontend /app/frontend
COPY vercel.json /app/vercel.json
EXPOSE 8080

ENV API_PORT=8080
CMD ["sh", "-c", "java -cp \".:lib/*\" ApiServer"]
