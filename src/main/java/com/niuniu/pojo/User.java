package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Integer id;
    private String username;
    private String studentId;
    private String name;
    private Integer age;
    private String gender;
    private String email;
    private String phone;
    private String major;
    private String advisor;
    private String grade;
    private String status;
    private String enrollmentDate;
    private String expectedGraduation;
    private Double gpa;
    private LocalDateTime updateTime;
}