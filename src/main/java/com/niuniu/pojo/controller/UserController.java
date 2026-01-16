package com.niuniu.pojo.controller;

import com.niuniu.mapper.UserMapper;
import com.niuniu.pojo.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UserController {

    @Autowired
    private UserMapper userMapper;

    @GetMapping("/test")
    public String test() {
        return "研究生信息管理系统API运行正常！当前时间：" + LocalDateTime.now();
    }

    @GetMapping("/health")
    public String health() {
        return "{\"status\": \"UP\", \"timestamp\": \"" + LocalDateTime.now() + "\"}";
    }

    /**
     * 获取所有用户
     * @return 用户列表
     */
    @GetMapping("/users")
    public List<User> getUsers() {
        System.out.println("=== 开始从MySQL数据库读取研究生信息 ===");
        try {
            List<User> userList = userMapper.selectAll();
            System.out.println("成功从数据库读取到 " + userList.size() + " 条记录");
            return userList;
        } catch (Exception e) {
            System.out.println("从数据库读取数据发生异常: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("数据库查询失败: " + e.getMessage(), e);
        }
    }

    /**
     * 根据ID获取用户
     * @param id 用户ID
     * @return 用户对象
     */
    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userMapper.selectById(id);
    }

    /**
     * 根据条件查询用户
     * @param keyword 关键词（姓名、学号、专业、导师）
     * @param major 专业
     * @param grade 年级
     * @return 用户列表
     */
    @GetMapping("/users/search")
    public List<User> searchUsers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String grade) {
        return userMapper.selectByCondition(keyword, major, grade);
    }

    /**
     * 分页查询用户
     * @param keyword 关键词（姓名、学号、专业、导师）
     * @param major 专业
     * @param grade 年级
     * @param page 页码（从1开始）
     * @param pageSize 每页大小
     * @return 分页结果
     */
    @GetMapping("/users/page")
    public Map<String, Object> getUsersByPage(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String major,
            @RequestParam(required = false) String grade,
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
        int total = userMapper.countByCondition(keyword, major, grade);
        
        // 查询分页数据
        List<User> users = userMapper.selectByPage(keyword, major, grade, offset, pageSize);
        
        // 计算总页数
        int totalPages = (int) Math.ceil((double) total / pageSize);
        
        result.put("data", users);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", totalPages);
        result.put("hasNext", page < totalPages);
        result.put("hasPrev", page > 1);
        
        return result;
    }

    /**
     * 新增用户
     * @param user 用户对象
     * @return 操作结果
     */
    @PostMapping("/users")
    public Map<String, Object> addUser(@RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            if (user.getUpdateTime() == null) {
                user.setUpdateTime(LocalDateTime.now());
            }
            int rows = userMapper.insert(user);
            result.put("success", rows > 0);
            result.put("message", rows > 0 ? "添加成功" : "添加失败");
            result.put("data", user);
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "添加失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 更新用户
     * @param id 用户ID
     * @param user 用户对象
     * @return 操作结果
     */
    @PutMapping("/users/{id}")
    public Map<String, Object> updateUser(@PathVariable Integer id, @RequestBody User user) {
        Map<String, Object> result = new HashMap<>();
        try {
            user.setId(id);
            if (user.getUpdateTime() == null) {
                user.setUpdateTime(LocalDateTime.now());
            }
            int rows = userMapper.update(user);
            result.put("success", rows > 0);
            result.put("message", rows > 0 ? "更新成功" : "更新失败");
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "更新失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 删除用户
     * @param id 用户ID
     * @return 操作结果
     */
    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        Map<String, Object> result = new HashMap<>();
        try {
            int rows = userMapper.deleteById(id);
            result.put("success", rows > 0);
            result.put("message", rows > 0 ? "删除成功" : "删除失败");
            return result;
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "删除失败: " + e.getMessage());
            return result;
        }
    }

    /**
     * 获取专业统计信息
     * @return 专业统计列表
     */
    @GetMapping("/stats/majors")
    public List<Map<String, Object>> getMajorStats() {
        List<User> users = userMapper.selectAll();
        
        // 按专业分组统计
        Map<String, Long> majorCountMap = users.stream()
                .filter(u -> u.getMajor() != null && !u.getMajor().isEmpty())
                .collect(Collectors.groupingBy(User::getMajor, Collectors.counting()));
        
        return majorCountMap.entrySet().stream()
                .map(entry -> {
                    Map<String, Object> stat = new HashMap<>();
                    stat.put("major", entry.getKey());
                    stat.put("count", entry.getValue());
                    return stat;
                })
                .collect(Collectors.toList());
    }
}