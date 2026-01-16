package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Semester {
    private Integer id;
    private String semesterName;
    private String semesterCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isCurrent;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

