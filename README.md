# Graduate Management MyBatis

![Java](https://img.shields.io/badge/Java-Spring%20Boot-orange)
![MyBatis](https://img.shields.io/badge/ORM-MyBatis-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479a1)
![Type](https://img.shields.io/badge/Project-Course%20Management-green)

## Overview

This repository is a Spring Boot + MyBatis practice project for graduate or course-management related data handling. Compared with the simpler `graduate_management` project, this version includes mapper interfaces, MyBatis XML files, SQL resources, and richer domain models.

## Highlights

- Spring Boot + MyBatis backend structure
- domain objects for users, teachers, courses, semesters, and student-course relations
- bundled API notes and database design documents
- static HTML pages included in the project

## Project Structure

- `pom.xml`: Maven configuration
- `src/main/java/com/niuniu/`: application source code
- `src/main/resources/application.yml`: Spring Boot and database configuration
- `src/main/resources/mapper/`: MyBatis mapper XML files
- `src/main/resources/sql/`: SQL resources
- `API接口文档.md`: API notes
- `数据库设计说明.md`: database design notes

## Build

```bash
mvn clean package
```

## Run

```bash
mvn spring-boot:run
```

## Notes

- The current `application.yml` points to a local MySQL instance and should be adjusted before running elsewhere.
- The repository still includes `.idea/` and `target/` artifacts from local development.
