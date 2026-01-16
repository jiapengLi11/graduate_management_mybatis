package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudentCourse {
    private Integer id;
    private String studentNo;
    private Integer courseId;
    private String status;
    private BigDecimal grade;
    private LocalDateTime selectTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

