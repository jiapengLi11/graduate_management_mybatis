# API 接口文档

## 📋 目录

- [基础信息](#基础信息)
- [学生信息管理接口](#学生信息管理接口)
- [课程管理接口](#课程管理接口)
- [数据模型](#数据模型)
- [错误码说明](#错误码说明)

---

## 基础信息

### 基础URL
```
http://localhost:8080
```

### 请求格式
- Content-Type: `application/json`
- 字符编码: `UTF-8`

### 响应格式
- Content-Type: `application/json`
- 字符编码: `UTF-8`

### 跨域支持
所有接口均支持跨域请求（CORS）

---

## 学生信息管理接口

### 1. 测试接口

**接口地址**: `GET /api/test`

**接口说明**: 测试API是否正常运行

**请求参数**: 无

**响应示例**:
```json
"研究生信息管理系统API运行正常！当前时间：2025-01-XX XX:XX:XX"
```

---

### 2. 健康检查

**接口地址**: `GET /api/health`

**接口说明**: 检查服务健康状态

**请求参数**: 无

**响应示例**:
```json
{
  "status": "UP",
  "timestamp": "2025-01-XX XX:XX:XX"
}
```

---

### 3. 获取所有学生

**接口地址**: `GET /api/users`

**接口说明**: 获取所有学生信息列表

**请求参数**: 无

**响应示例**:
```json
[
  {
    "id": 1,
    "username": "zhangsan",
    "studentId": "S2024001",
    "name": "张三",
    "age": 25,
    "gender": "男",
    "email": "zhangsan@example.com",
    "phone": "13800138000",
    "major": "计算机科学与技术",
    "advisor": "李教授",
    "grade": "研一",
    "status": "在读",
    "enrollmentDate": "2024-09-01",
    "expectedGraduation": "2027-06-30",
    "gpa": 3.8,
    "updateTime": "2025-01-01T10:00:00"
  }
]
```

---

### 4. 根据ID获取学生

**接口地址**: `GET /api/users/{id}`

**接口说明**: 根据学生ID获取详细信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 学生ID |

**请求示例**:
```
GET /api/users/1
```

**响应示例**:
```json
{
  "id": 1,
  "username": "zhangsan",
  "studentId": "S2024001",
  "name": "张三",
  ...
}
```

---

### 5. 条件查询学生

**接口地址**: `GET /api/users/search`

**接口说明**: 根据条件查询学生（支持模糊查询）

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| keyword | String | 否 | 关键词（姓名、学号、专业、导师） |
| major | String | 否 | 专业 |
| grade | String | 否 | 年级 |

**请求示例**:
```
GET /api/users/search?keyword=张三&major=计算机科学与技术&grade=研一
```

**响应示例**:
```json
[
  {
    "id": 1,
    "name": "张三",
    ...
  }
]
```

---

### 6. 分页查询学生

**接口地址**: `GET /api/users/page`

**接口说明**: 分页查询学生信息

**查询参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| keyword | String | 否 | - | 关键词 |
| major | String | 否 | - | 专业 |
| grade | String | 否 | - | 年级 |
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 10 | 每页大小（最大100） |

**请求示例**:
```
GET /api/users/page?page=1&pageSize=20&major=计算机科学与技术
```

**响应示例**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "张三",
      ...
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20,
  "totalPages": 5,
  "hasNext": true,
  "hasPrev": false
}
```

---

### 7. 新增学生

**接口地址**: `POST /api/users`

**接口说明**: 新增学生信息

**请求体**:
```json
{
  "username": "lisi",
  "studentId": "S2024002",
  "name": "李四",
  "age": 24,
  "gender": "女",
  "email": "lisi@example.com",
  "phone": "13900139000",
  "major": "软件工程",
  "advisor": "王教授",
  "grade": "研一",
  "status": "在读",
  "enrollmentDate": "2024-09-01",
  "expectedGraduation": "2027-06-30",
  "gpa": 3.9
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "添加成功",
  "data": {
    "id": 2,
    ...
  }
}
```

---

### 8. 更新学生信息

**接口地址**: `PUT /api/users/{id}`

**接口说明**: 更新指定学生的信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 学生ID |

**请求体**: 同新增接口，包含需要更新的字段

**响应示例**:
```json
{
  "success": true,
  "message": "更新成功"
}
```

---

### 9. 删除学生

**接口地址**: `DELETE /api/users/{id}`

**接口说明**: 删除指定学生

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| id | Integer | 是 | 学生ID |

**响应示例**:
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 10. 获取专业统计信息

**接口地址**: `GET /api/stats/majors`

**接口说明**: 获取各专业的学生人数统计

**请求参数**: 无

**响应示例**:
```json
[
  {
    "major": "计算机科学与技术",
    "count": 50
  },
  {
    "major": "软件工程",
    "count": 30
  }
]
```

---

## 课程管理接口

### 1. 获取所有学期

**接口地址**: `GET /api/courses/semesters`

**接口说明**: 获取所有学期列表

**请求参数**: 无

**响应示例**:
```json
[
  {
    "id": 1,
    "semesterName": "2024-2025 学年第 1 学期",
    "semesterCode": "2024-2025-1",
    "startDate": "2024-09-01",
    "endDate": "2025-01-15",
    "isCurrent": true,
    "createTime": "2024-08-01T00:00:00",
    "updateTime": "2024-08-01T00:00:00"
  }
]
```

---

### 2. 获取学生已选课程列表

**接口地址**: `GET /api/courses/student/{studentNo}`

**接口说明**: 根据学号获取该学生的所有已选课程

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentNo | String | 是 | 学生学号 |

**请求示例**:
```
GET /api/courses/student/S2024001
```

**响应示例**:
```json
[
  {
    "selectId": 1,
    "studentNo": "S2024001",
    "selectStatus": "待修读",
    "grade": null,
    "selectTime": "2024-09-01T10:00:00",
    "courseId": 1,
    "courseNo": "CS001",
    "courseName": "高级数据结构",
    "courseType": "专业核心",
    "credits": 3.0,
    "theoryHours": 48,
    "practiceHours": 16,
    "hoursDisplay": "48/16",
    "semesterName": "2024-2025 学年第 1 学期",
    "semesterCode": "2024-2025-1",
    "classTime": "周三 第 3-4 节",
    "classroom": "计算机学院 201 教室",
    "teachers": "张教授，李副教授",
    "totalHours": 64
  }
]
```

---

### 3. 条件查询已选课程

**接口地址**: `GET /api/courses/student/{studentNo}/search`

**接口说明**: 根据条件查询学生的已选课程（支持筛选）

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentNo | String | 是 | 学生学号 |

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| semesterCode | String | 否 | 学期代码（如：2024-2025-1） |
| courseType | String | 否 | 课程类型（必修/选修/专业核心/公共基础） |
| keyword | String | 否 | 关键词（课程名称或课程号，支持模糊查询） |

**请求示例**:
```
GET /api/courses/student/S2024001/search?semesterCode=2024-2025-1&courseType=必修&keyword=数据结构
```

**响应示例**: 同接口2的响应格式

---

### 4. 分页查询已选课程

**接口地址**: `GET /api/courses/student/{studentNo}/page`

**接口说明**: 分页查询学生的已选课程

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentNo | String | 是 | 学生学号 |

**查询参数**:
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| semesterCode | String | 否 | - | 学期代码 |
| courseType | String | 否 | - | 课程类型 |
| keyword | String | 否 | - | 关键词 |
| page | Integer | 否 | 1 | 页码（从1开始） |
| pageSize | Integer | 否 | 10 | 每页大小（最大100） |

**请求示例**:
```
GET /api/courses/student/S2024001/page?page=1&pageSize=20&courseType=必修
```

**响应示例**:
```json
{
  "data": [
    {
      "selectId": 1,
      "courseNo": "CS001",
      "courseName": "高级数据结构",
      ...
    }
  ],
  "total": 10,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1,
  "hasNext": false,
  "hasPrev": false
}
```

---

### 5. 获取学生课程统计信息

**接口地址**: `GET /api/courses/student/{studentNo}/stats`

**接口说明**: 获取学生的课程统计信息

**路径参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| studentNo | String | 是 | 学生学号 |

**请求示例**:
```
GET /api/courses/student/S2024001/stats
```

**响应示例**:
```json
{
  "totalCourses": 10,
  "completedCourses": 5,
  "pendingCourses": 5,
  "totalCredits": 25.5,
  "avgHours": 48.5,
  "maxHoursCourse": {
    "courseName": "高级数据结构",
    "hours": 64
  }
}
```

**字段说明**:
| 字段名 | 类型 | 说明 |
|--------|------|------|
| totalCourses | Integer | 已选课程总数 |
| completedCourses | Integer | 已修读课程数 |
| pendingCourses | Integer | 待修读课程数 |
| totalCredits | Double | 已修学分总数 |
| avgHours | Double | 平均学时 |
| maxHoursCourse | Object | 最长学时课程信息（可能为null） |
| maxHoursCourse.courseName | String | 课程名称 |
| maxHoursCourse.hours | Integer | 总学时 |

---

## 数据模型

### User（学生信息）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | Integer | 学生ID |
| username | String | 用户名 |
| studentId | String | 学号 |
| name | String | 姓名 |
| age | Integer | 年龄 |
| gender | String | 性别 |
| email | String | 邮箱 |
| phone | String | 电话 |
| major | String | 专业 |
| advisor | String | 导师 |
| grade | String | 年级 |
| status | String | 状态 |
| enrollmentDate | String | 入学日期 |
| expectedGraduation | String | 预计毕业日期 |
| gpa | Double | GPA |
| updateTime | LocalDateTime | 更新时间 |

### StudentCourseDetail（学生选课详情）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| selectId | Integer | 选课记录ID |
| studentNo | String | 学生学号 |
| selectStatus | String | 选课状态（待修读/已修读/已结课） |
| grade | BigDecimal | 成绩 |
| selectTime | LocalDateTime | 选课时间 |
| courseId | Integer | 课程ID |
| courseNo | String | 课程号 |
| courseName | String | 课程名称 |
| courseType | String | 课程类型 |
| credits | BigDecimal | 学分 |
| theoryHours | Integer | 理论学时 |
| practiceHours | Integer | 实践学时 |
| hoursDisplay | String | 学时显示（理论/实践） |
| semesterName | String | 学期名称 |
| semesterCode | String | 学期代码 |
| classTime | String | 开课时间 |
| classroom | String | 上课地点 |
| teachers | String | 授课老师（多个用"，"分隔） |
| totalHours | Integer | 总学时 |

### Semester（学期）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | Integer | 学期ID |
| semesterName | String | 学期名称 |
| semesterCode | String | 学期代码 |
| startDate | LocalDate | 开始日期 |
| endDate | LocalDate | 结束日期 |
| isCurrent | Boolean | 是否为当前学期 |
| createTime | LocalDateTime | 创建时间 |
| updateTime | LocalDateTime | 更新时间 |

---

## 错误码说明

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 错误响应格式

```json
{
  "success": false,
  "message": "错误信息描述",
  "error": "详细错误信息（可选）"
}
```

### 常见错误

1. **数据库连接失败**
   - 检查数据库配置是否正确
   - 确认数据库服务是否启动

2. **参数错误**
   - 检查请求参数格式是否正确
   - 确认必填参数是否提供

3. **数据不存在**
   - 确认查询条件是否正确
   - 检查数据库中是否存在对应数据

---

## 接口调用示例

### JavaScript (Fetch API)

```javascript
// 获取学生列表
fetch('http://localhost:8080/api/users/page?page=1&pageSize=10')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });

// 获取学生已选课程
fetch('http://localhost:8080/api/courses/student/S2024001')
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });

// 新增学生
fetch('http://localhost:8080/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'test',
    studentId: 'S2024999',
    name: '测试学生',
    // ... 其他字段
  })
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
```

### cURL

```bash
# 获取学生列表
curl -X GET "http://localhost:8080/api/users/page?page=1&pageSize=10"

# 获取学生已选课程
curl -X GET "http://localhost:8080/api/courses/student/S2024001"

# 新增学生
curl -X POST "http://localhost:8080/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test",
    "studentId": "S2024999",
    "name": "测试学生"
  }'
```

---

## 注意事项

1. **分页参数**: 
   - `page` 从1开始，不是从0开始
   - `pageSize` 最大值为100，超过会自动限制为100

2. **日期格式**:
   - 日期字段使用 `yyyy-MM-dd` 格式
   - 日期时间字段使用 ISO 8601 格式（如：`2025-01-01T10:00:00`）

3. **模糊查询**:
   - `keyword` 参数支持对多个字段进行模糊查询
   - 课程名称和课程号支持模糊匹配

4. **跨域请求**:
   - 所有接口都支持CORS，可以直接在前端调用

5. **数据验证**:
   - 建议在前端和后端都进行数据验证
   - 必填字段未提供时会返回错误

---

**最后更新**: 2025-01-XX

