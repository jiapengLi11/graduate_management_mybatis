package com.niuniu.mapper;

import com.niuniu.pojo.Semester;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SemesterMapper {
    
    /**
     * 查询所有学期
     * @return 学期列表
     */
    List<Semester> selectAll();
    
    /**
     * 根据ID查询学期
     * @param id 学期ID
     * @return 学期对象
     */
    Semester selectById(Integer id);
    
    /**
     * 根据学期代码查询学期
     * @param semesterCode 学期代码
     * @return 学期对象
     */
    Semester selectByCode(String semesterCode);
}

