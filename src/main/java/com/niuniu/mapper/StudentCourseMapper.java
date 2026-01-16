package com.niuniu.mapper;

import com.niuniu.pojo.StudentCourseDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface StudentCourseMapper {
    
    /**
     * 根据学号查询已选课程详细信息（使用视图）
     * @param studentNo 学生学号
     * @return 已选课程详细信息列表
     */
    List<StudentCourseDetail> selectByStudentNo(@Param("studentNo") String studentNo);
    
    /**
     * 根据学号和条件查询已选课程（支持筛选）
     * @param studentNo 学生学号
     * @param semesterCode 学期代码（可选）
     * @param courseType 课程类型（可选）
     * @param keyword 关键词（课程名称或课程号，可选）
     * @return 已选课程详细信息列表
     */
    List<StudentCourseDetail> selectByCondition(
            @Param("studentNo") String studentNo,
            @Param("semesterCode") String semesterCode,
            @Param("courseType") String courseType,
            @Param("keyword") String keyword);
    
    /**
     * 分页查询已选课程
     * @param studentNo 学生学号
     * @param semesterCode 学期代码（可选）
     * @param courseType 课程类型（可选）
     * @param keyword 关键词（课程名称或课程号，可选）
     * @param offset 偏移量
     * @param pageSize 每页大小
     * @return 已选课程详细信息列表
     */
    List<StudentCourseDetail> selectByPage(
            @Param("studentNo") String studentNo,
            @Param("semesterCode") String semesterCode,
            @Param("courseType") String courseType,
            @Param("keyword") String keyword,
            @Param("offset") Integer offset,
            @Param("pageSize") Integer pageSize);
    
    /**
     * 统计符合条件的已选课程总数
     * @param studentNo 学生学号
     * @param semesterCode 学期代码（可选）
     * @param courseType 课程类型（可选）
     * @param keyword 关键词（课程名称或课程号，可选）
     * @return 总数
     */
    int countByCondition(
            @Param("studentNo") String studentNo,
            @Param("semesterCode") String semesterCode,
            @Param("courseType") String courseType,
            @Param("keyword") String keyword);
    
    /**
     * 统计已选课程总数
     * @param studentNo 学生学号
     * @return 总数
     */
    int countByStudentNo(@Param("studentNo") String studentNo);
    
    /**
     * 统计已修学分总数
     * @param studentNo 学生学号
     * @return 已修学分总数
     */
    Double sumCreditsByStudentNo(@Param("studentNo") String studentNo);
    
    /**
     * 统计平均学时
     * @param studentNo 学生学号
     * @return 平均学时
     */
    Double avgHoursByStudentNo(@Param("studentNo") String studentNo);
    
    /**
     * 统计已修读课程数
     * @param studentNo 学生学号
     * @return 已修读课程数
     */
    int countCompletedCourses(@Param("studentNo") String studentNo);
    
    /**
     * 统计待修读课程数
     * @param studentNo 学生学号
     * @return 待修读课程数
     */
    int countPendingCourses(@Param("studentNo") String studentNo);
}

