package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 学生选课详细信息视图实体类
 * 对应数据库视图 v_student_courses_detail
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourseDetail {
    private Integer selectId;
    private String studentNo;
    private String selectStatus;
    private BigDecimal grade;
    private LocalDateTime selectTime;
    private Integer courseId;
    private String courseNo;
    private String courseName;
    private String courseType;
    private BigDecimal credits;
    private Integer theoryHours;
    private Integer practiceHours;
    private String hoursDisplay;
    private String semesterName;
    private String semesterCode;
    private String classTime;
    private String classroom;
    private String teachers;
    private Integer totalHours;
}

