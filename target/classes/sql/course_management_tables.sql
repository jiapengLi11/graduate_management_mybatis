-- ============================================
-- 课程管理系统数据库表设计
-- 数据库：db02
-- 创建时间：2025-01-XX
-- ============================================

-- 1. 学期表（semesters）
-- 用途：存储学期信息，用于课程筛选和展示
DROP TABLE IF EXISTS `semesters`;
CREATE TABLE `semesters` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '学期ID',
    `semester_name` VARCHAR(50) NOT NULL UNIQUE COMMENT '学期名称，如：2024-2025 学年第 1 学期',
    `semester_code` VARCHAR(20) NOT NULL UNIQUE COMMENT '学期代码，如：2024-2025-1',
    `start_date` DATE COMMENT '学期开始日期',
    `end_date` DATE COMMENT '学期结束日期',
    `is_current` TINYINT(1) DEFAULT 0 COMMENT '是否为当前学期（0-否，1-是）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_semester_code` (`semester_code`),
    INDEX `idx_is_current` (`is_current`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学期信息表';

-- 2. 教师表（teachers）
-- 用途：存储教师基本信息
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '教师ID',
    `teacher_no` VARCHAR(20) NOT NULL UNIQUE COMMENT '教师工号',
    `teacher_name` VARCHAR(50) NOT NULL COMMENT '教师姓名',
    `department` VARCHAR(100) COMMENT '所属学院/部门',
    `title` VARCHAR(50) COMMENT '职称，如：教授、副教授、讲师',
    `email` VARCHAR(100) COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '联系电话',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX `idx_teacher_no` (`teacher_no`),
    INDEX `idx_teacher_name` (`teacher_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='教师信息表';

-- 3. 课程表（courses）
-- 用途：存储课程基本信息
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
    `course_no` VARCHAR(20) NOT NULL UNIQUE COMMENT '课程号，唯一标识',
    `course_name` VARCHAR(200) NOT NULL COMMENT '课程名称',
    `course_type` VARCHAR(20) NOT NULL COMMENT '课程类型：必修、选修、专业核心、公共基础',
    `credits` DECIMAL(3,1) NOT NULL COMMENT '学分',
    `theory_hours` INT DEFAULT 0 COMMENT '理论学时',
    `practice_hours` INT DEFAULT 0 COMMENT '实践学时',
    `semester_id` INT COMMENT '开课学期ID，关联semesters表',
    `class_time` VARCHAR(100) COMMENT '开课时间，格式：周X 第X-X节，如：周三 第 3-4 节',
    `classroom` VARCHAR(200) COMMENT '上课地点，如：计算机学院 201 教室',
    `capacity` INT DEFAULT 0 COMMENT '课程容量（可选人数）',
    `selected_count` INT DEFAULT 0 COMMENT '已选人数',
    `course_description` TEXT COMMENT '课程描述',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    FOREIGN KEY (`semester_id`) REFERENCES `semesters`(`id`) ON DELETE SET NULL,
    INDEX `idx_course_no` (`course_no`),
    INDEX `idx_course_name` (`course_name`),
    INDEX `idx_course_type` (`course_type`),
    INDEX `idx_semester_id` (`semester_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程信息表';

-- 4. 课程教师关联表（course_teachers）
-- 用途：存储课程与教师的关联关系（多对多）
DROP TABLE IF EXISTS `course_teachers`;
CREATE TABLE `course_teachers` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    `course_id` INT NOT NULL COMMENT '课程ID，关联courses表',
    `teacher_id` INT NOT NULL COMMENT '教师ID，关联teachers表',
    `is_main_teacher` TINYINT(1) DEFAULT 0 COMMENT '是否为主讲教师（0-否，1-是）',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_course_teacher` (`course_id`, `teacher_id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE CASCADE,
    INDEX `idx_course_id` (`course_id`),
    INDEX `idx_teacher_id` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程教师关联表';

-- 5. 学生选课关联表（student_courses）
-- 用途：存储学生选课关系，核心表，用于已选课程展示
DROP TABLE IF EXISTS `student_courses`;
CREATE TABLE `student_courses` (
    `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '选课记录ID',
    `student_no` VARCHAR(20) NOT NULL COMMENT '学生学号，关联user表的student_no',
    `course_id` INT NOT NULL COMMENT '课程ID，关联courses表',
    `status` VARCHAR(20) NOT NULL DEFAULT '待修读' COMMENT '选课状态：待修读、已修读、已结课',
    `grade` DECIMAL(5,2) COMMENT '成绩（已修读课程才有成绩）',
    `select_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '选课时间',
    `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY `uk_student_course` (`student_no`, `course_id`),
    FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE,
    INDEX `idx_student_no` (`student_no`),
    INDEX `idx_course_id` (`course_id`),
    INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='学生选课关联表';

-- ============================================
-- 初始化测试数据（可选）
-- ============================================

-- 插入学期数据
INSERT INTO `semesters` (`semester_name`, `semester_code`, `start_date`, `end_date`, `is_current`) VALUES
('2024-2025 学年第 1 学期', '2024-2025-1', '2024-09-01', '2025-01-15', 1),
('2023-2024 学年第 2 学期', '2023-2024-2', '2024-02-20', '2024-07-10', 0),
('2023-2024 学年第 1 学期', '2023-2024-1', '2023-09-01', '2024-01-15', 0);

-- 插入教师数据示例
INSERT INTO `teachers` (`teacher_no`, `teacher_name`, `department`, `title`, `email`) VALUES
('T001', '张教授', '计算机学院', '教授', 'zhang@university.edu.cn'),
('T002', '李副教授', '计算机学院', '副教授', 'li@university.edu.cn'),
('T003', '王老师', '数学学院', '讲师', 'wang@university.edu.cn');

-- 插入课程数据示例
INSERT INTO `courses` (`course_no`, `course_name`, `course_type`, `credits`, `theory_hours`, `practice_hours`, `semester_id`, `class_time`, `classroom`) VALUES
('CS001', '高级数据结构', '专业核心', 3.0, 48, 16, 1, '周三 第 3-4 节', '计算机学院 201 教室'),
('CS002', '机器学习', '必修', 3.5, 56, 0, 1, '周一 第 1-2 节', '计算机学院 301 教室'),
('CS003', '软件工程实践', '选修', 2.0, 32, 32, 1, '周五 第 5-6 节', '计算机学院 实验室'),
('MATH001', '高等数学', '公共基础', 4.0, 64, 0, 1, '周二 第 3-4 节', '数学学院 101 教室');

-- 插入课程教师关联数据
INSERT INTO `course_teachers` (`course_id`, `teacher_id`, `is_main_teacher`) VALUES
(1, 1, 1),
(2, 1, 1),
(3, 2, 1),
(4, 3, 1);

-- 插入学生选课数据示例（假设学号为 'S2024001' 的学生）
INSERT INTO `student_courses` (`student_no`, `course_id`, `status`, `grade`) VALUES
('S2024001', 1, '待修读', NULL),
('S2024001', 2, '已修读', 85.5),
('S2024001', 3, '待修读', NULL),
('S2024001', 4, '已结课', 92.0);

-- ============================================
-- 查询视图：已选课程详细信息视图（便于查询）
-- ============================================
DROP VIEW IF EXISTS `v_student_courses_detail`;
CREATE VIEW `v_student_courses_detail` AS
SELECT 
    sc.id AS select_id,
    sc.student_no,
    sc.status AS select_status,
    sc.grade,
    sc.select_time,
    c.id AS course_id,
    c.course_no,
    c.course_name,
    c.course_type,
    c.credits,
    c.theory_hours,
    c.practice_hours,
    CONCAT(c.theory_hours, '/', c.practice_hours) AS hours_display,
    s.semester_name,
    s.semester_code,
    c.class_time,
    c.classroom,
    GROUP_CONCAT(t.teacher_name ORDER BY ct.is_main_teacher DESC SEPARATOR '，') AS teachers,
    (c.theory_hours + c.practice_hours) AS total_hours
FROM 
    student_courses sc
    INNER JOIN courses c ON sc.course_id = c.id
    LEFT JOIN semesters s ON c.semester_id = s.id
    LEFT JOIN course_teachers ct ON c.id = ct.course_id
    LEFT JOIN teachers t ON ct.teacher_id = t.id
GROUP BY 
    sc.id, sc.student_no, sc.status, sc.grade, sc.select_time,
    c.id, c.course_no, c.course_name, c.course_type, c.credits,
    c.theory_hours, c.practice_hours, s.semester_name, s.semester_code,
    c.class_time, c.classroom;


