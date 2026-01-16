package com.niuniu.pojo.controller;

import com.niuniu.mapper.SemesterMapper;
import com.niuniu.mapper.StudentCourseMapper;
import com.niuniu.pojo.Semester;
import com.niuniu.pojo.StudentCourseDetail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin
public class CourseController {

    @Autowired
    private StudentCourseMapper studentCourseMapper;

    @Autowired
    private SemesterMapper semesterMapper;

    /**
     * 获取所有学期列表
     * @return 学期列表
     */
    @GetMapping("/semesters")
    public List<Semester> getSemesters() {
        return semesterMapper.selectAll();
    }

    /**
     * 根据学号查询已选课程列表
     * @param studentNo 学生学号
     * @return 已选课程列表
     */
    @GetMapping("/student/{studentNo}")
    public List<StudentCourseDetail> getStudentCourses(@PathVariable String studentNo) {
        return studentCourseMapper.selectByStudentNo(studentNo);
    }

    /**
     * 根据条件查询已选课程（支持筛选）
     * @param studentNo 学生学号
     * @param semesterCode 学期代码（可选）
     * @param courseType 课程类型（可选）
     * @param keyword 关键词（课程名称或课程号，可选）
     * @return 已选课程列表
     */
    @GetMapping("/student/{studentNo}/search")
    public List<StudentCourseDetail> searchStudentCourses(
            @PathVariable String studentNo,
            @RequestParam(required = false) String semesterCode,
            @RequestParam(required = false) String courseType,
            @RequestParam(required = false) String keyword) {
        return studentCourseMapper.selectByCondition(studentNo, semesterCode, courseType, keyword);
    }

    /**
     * 分页查询已选课程
     * @param studentNo 学生学号
     * @param semesterCode 学期代码（可选）
     * @param courseType 课程类型（可选）
     * @param keyword 关键词（课程名称或课程号，可选）
     * @param page 页码（从1开始）
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @GetMapping("/student/{studentNo}/page")
    public Map<String, Object> getStudentCoursesByPage(
            @PathVariable String studentNo,
            @RequestParam(required = false) String semesterCode,
            @RequestParam(required = false) String courseType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        Map<String, Object> result = new HashMap<>();

        // 参数校验
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100; // 限制最大每页数量

        // 计算偏移量
        int offset = (page - 1) * pageSize;

        // 查询总数
        int total = studentCourseMapper.countByCondition(studentNo, semesterCode, courseType, keyword);

        // 查询分页数据
        List<StudentCourseDetail> courses = studentCourseMapper.selectByPage(
                studentNo, semesterCode, courseType, keyword, offset, pageSize);

        // 计算总页数
        int totalPages = (int) Math.ceil((double) total / pageSize);

        result.put("data", courses);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", totalPages);
        result.put("hasNext", page < totalPages);
        result.put("hasPrev", page > 1);

        return result;
    }

    /**
     * 获取学生课程统计信息
     * @param studentNo 学生学号
     * @return 统计信息
     */
    @GetMapping("/student/{studentNo}/stats")
    public Map<String, Object> getStudentCourseStats(@PathVariable String studentNo) {
        Map<String, Object> stats = new HashMap<>();

        // 已选课程总数
        int totalCourses = studentCourseMapper.countByStudentNo(studentNo);
        stats.put("totalCourses", totalCourses);

        // 已修读课程数
        int completedCourses = studentCourseMapper.countCompletedCourses(studentNo);
        stats.put("completedCourses", completedCourses);

        // 待修读课程数
        int pendingCourses = studentCourseMapper.countPendingCourses(studentNo);
        stats.put("pendingCourses", pendingCourses);

        // 已修学分总数
        Double totalCredits = studentCourseMapper.sumCreditsByStudentNo(studentNo);
        stats.put("totalCredits", totalCredits != null ? totalCredits : 0.0);

        // 平均学时
        Double avgHours = studentCourseMapper.avgHoursByStudentNo(studentNo);
        stats.put("avgHours", avgHours != null ? avgHours : 0.0);

        // 查询最长学时课程
        List<StudentCourseDetail> allCourses = studentCourseMapper.selectByStudentNo(studentNo);
        StudentCourseDetail maxHoursCourse = null;
        int maxHours = 0;
        for (StudentCourseDetail course : allCourses) {
            if (course.getTotalHours() != null && course.getTotalHours() > maxHours) {
                maxHours = course.getTotalHours();
                maxHoursCourse = course;
            }
        }
        if (maxHoursCourse != null) {
            Map<String, Object> maxCourseInfo = new HashMap<>();
            maxCourseInfo.put("courseName", maxHoursCourse.getCourseName());
            maxCourseInfo.put("hours", maxHoursCourse.getTotalHours());
            stats.put("maxHoursCourse", maxCourseInfo);
        } else {
            stats.put("maxHoursCourse", null);
        }

        return stats;
    }
}

