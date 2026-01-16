package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    private Integer id;
    private String courseNo;
    private String courseName;
    private String courseType;
    private BigDecimal credits;
    private Integer theoryHours;
    private Integer practiceHours;
    private Integer semesterId;
    private String classTime;
    private String classroom;
    private Integer capacity;
    private Integer selectedCount;
    private String courseDescription;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

