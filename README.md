# Graduate Management MyBatis

## Overview

This repository is a Spring Boot + MyBatis practice project for graduate or course-management related data handling. Compared with the simpler `graduate_management` project, this version includes mapper interfaces, MyBatis XML files, SQL resources, and richer domain models.

## Tech Stack

- Java
- Spring Boot
- MyBatis
- MySQL
- Maven

## Project Structure

- `pom.xml`: Maven configuration
- `src/main/java/com/niuniu/`: application source code
- `src/main/resources/application.yml`: Spring Boot and database configuration
- `src/main/resources/mapper/`: MyBatis mapper XML files
- `src/main/resources/sql/`: SQL resources
- `API接口文档.md`: API notes
- `数据库设计说明.md`: database design notes

## Current Domain Objects

The `pojo` package includes classes such as:

- `User`
- `Teacher`
- `Course`
- `Semester`
- `StudentCourse`
- `StudentCourseDetail`

The mapper package includes:

- `UserMapper`
- `SemesterMapper`
- `StudentCourseMapper`

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
- It already contains API and database documents, which makes it a good candidate for further cleanup and polishing.
