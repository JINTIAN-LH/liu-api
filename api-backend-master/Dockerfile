FROM maven:3.8-eclipse-temurin-8 as build
WORKDIR /build

COPY pom.xml .
COPY yuapi-common/pom.xml yuapi-common/
COPY yuapi-client-sdk/pom.xml yuapi-client-sdk/

COPY yuapi-common/src yuapi-common/src/
RUN mvn -f yuapi-common/pom.xml install -DskipTests -q

COPY yuapi-client-sdk/src yuapi-client-sdk/src/
RUN mvn -f yuapi-client-sdk/pom.xml install -DskipTests -q

COPY src src/
RUN mvn package -DskipTests -q

FROM eclipse-temurin:8-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 7529
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=demo"]
