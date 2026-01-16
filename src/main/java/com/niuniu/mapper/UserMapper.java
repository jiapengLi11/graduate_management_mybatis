package com.niuniu.mapper;

import com.niuniu.pojo.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
    
    /**
     * 查询所有用户
     * @return 用户列表
     */
    List<User> selectAll();
    
    /**
     * 根据ID查询用户
     * @param id 用户ID
     * @return 用户对象
     */
    User selectById(@Param("id") Integer id);
    
    /**
     * 根据学号查询用户
     * @param studentId 学号
     * @return 用户对象
     */
    User selectByStudentId(@Param("studentId") String studentId);
    
    /**
     * 插入用户
     * @param user 用户对象
     * @return 影响行数
     */
    int insert(User user);
    
    /**
     * 更新用户
     * @param user 用户对象
     * @return 影响行数
     */
    int update(User user);
    
    /**
     * 根据ID删除用户
     * @param id 用户ID
     * @return 影响行数
     */
    int deleteById(@Param("id") Integer id);
    
    /**
     * 根据条件查询用户（支持模糊查询）
     * @param keyword 关键词（姓名、学号、专业、导师）
     * @param major 专业
     * @param grade 年级
     * @return 用户列表
     */
    List<User> selectByCondition(@Param("keyword") String keyword, 
                                 @Param("major") String major, 
                                 @Param("grade") String grade);
    
    /**
     * 分页查询用户
     * @param keyword 关键词（姓名、学号、专业、导师）
     * @param major 专业
     * @param grade 年级
     * @param offset 偏移量
     * @param pageSize 每页大小
     * @return 用户列表
     */
    List<User> selectByPage(@Param("keyword") String keyword,
                           @Param("major") String major,
                           @Param("grade") String grade,
                           @Param("offset") Integer offset,
                           @Param("pageSize") Integer pageSize);
    
    /**
     * 统计符合条件的用户总数
     * @param keyword 关键词（姓名、学号、专业、导师）
     * @param major 专业
     * @param grade 年级
     * @return 总数
     */
    int countByCondition(@Param("keyword") String keyword,
                        @Param("major") String major,
                        @Param("grade") String grade);
}

