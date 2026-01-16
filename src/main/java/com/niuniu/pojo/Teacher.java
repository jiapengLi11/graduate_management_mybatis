package com.niuniu.pojo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    private Integer id;
    private String teacherNo;
    private String teacherName;
    private String department;
    private String title;
    private String email;
    private String phone;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}

