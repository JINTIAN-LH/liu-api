FROM maven:3.8-eclipse-temurin-8 as build
WORKDIR /build

COPY api-backend-master/pom.xml .
COPY api-backend-master/yuapi-common/pom.xml yuapi-common/
COPY api-backend-master/yuapi-client-sdk/pom.xml yuapi-client-sdk/

COPY api-backend-master/yuapi-common/src yuapi-common/src/
RUN mvn -f yuapi-common/pom.xml install -DskipTests -q

COPY api-backend-master/yuapi-client-sdk/src yuapi-client-sdk/src/
RUN mvn -f yuapi-client-sdk/pom.xml install -DskipTests -q

COPY api-backend-master/src src/
RUN mvn package -DskipTests -q

FROM eclipse-temurin:8-jre
WORKDIR /app
COPY --from=build /build/target/*.jar app.jar
EXPOSE 7529
CMD ["java", "-jar", "app.jar", "--spring.profiles.active=demo"]
