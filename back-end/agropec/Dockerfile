# Etapa 1: Build do JAR
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Copie o banco se quiser um inicial
COPY Agropec.db Agropec.db

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]