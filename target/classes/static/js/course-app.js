// 课程管理前端脚本
// 负责已选课程数据获取、表格渲染、筛选、排序、分页及导出

let courses = [];
let filteredCourses = [];
let sortState = { key: 'courseNo', asc: true };
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
};
let currentStudentNo = 'S2024001';
let semesters = [];

const el = (id) => document.getElementById(id);

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    loadSemesters();
    loadCourses();
});

// 加载学期列表
async function loadSemesters() {
    try {
        const res = await fetch('/api/courses/semesters');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        semesters = await res.json();
        
        const select = el('semesterFilter');
        if (select && semesters.length > 0) {
            semesters.forEach(semester => {
                const option = document.createElement('option');
                option.value = semester.semesterCode;
                option.textContent = semester.semesterName;
                select.appendChild(option);
            });
        }
    } catch (err) {
        console.error('加载学期列表失败:', err);
    }
}

// 加载课程数据
async function loadCourses() {
    await loadCoursesByPage(1);
}

async function loadCoursesByPage(page) {
    showLoading(true);
    toggleTable(false);
    toggleNoData(false);
    togglePagination(false);

    try {
        currentStudentNo = el('studentNoInput')?.value?.trim() || 'S2024001';
        if (!currentStudentNo) {
            alert('请输入学号');
            showLoading(false);
            return;
        }

        const semesterCode = el('semesterFilter')?.value || 'all';
        const courseType = el('courseTypeFilter')?.value || 'all';
        const keyword = el('keywordInput')?.value?.trim() || '';
        const pageSize = pagination.pageSize;

        // 构建查询参数
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        if (semesterCode && semesterCode !== 'all') params.append('semesterCode', semesterCode);
        if (courseType && courseType !== 'all') params.append('courseType', courseType);
        if (keyword) params.append('keyword', keyword);

        const res = await fetch(`/api/courses/student/${currentStudentNo}/page?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        if (!result.data || !Array.isArray(result.data)) {
            throw new Error('返回数据格式错误');
        }

        courses = result.data;
        filteredCourses = [...courses];

        // 更新分页信息
        pagination.currentPage = result.page || page;
        pagination.pageSize = result.pageSize || pageSize;
        pagination.total = result.total || 0;
        pagination.totalPages = result.totalPages || 1;

        // 加载统计信息
        await loadStats();

        renderTable(filteredCourses);
        renderPagination();
        updateTime();

        toggleTable(true);
        togglePagination(true);
    } catch (err) {
        console.error('加载数据失败:', err);
        toggleNoData(true, '数据加载失败，请检查后端接口或稍后重试。');
    } finally {
        showLoading(false);
    }
}

// 加载统计信息
async function loadStats() {
    try {
        const res = await fetch(`/api/courses/student/${currentStudentNo}/stats`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const stats = await res.json();

        el('totalCourses').textContent = stats.totalCourses || 0;
        el('completedCourses').textContent = stats.completedCourses || 0;
        el('pendingCourses').textContent = stats.pendingCourses || 0;
        
        const totalCredits = stats.totalCredits || 0;
        el('totalCredits').textContent = totalCredits.toFixed(1);
        
        const requiredCredits = 30; // 假设需要30学分
        const remainingCredits = Math.max(0, requiredCredits - totalCredits);
        el('remainingCredits').textContent = remainingCredits.toFixed(1);

        const avgHours = stats.avgHours || 0;
        el('avgHours').textContent = avgHours.toFixed(1);

        if (stats.maxHoursCourse) {
            el('maxHoursInfo').textContent = 
                `最长学时课程：${stats.maxHoursCourse.courseName}（${stats.maxHoursCourse.hours} 学时）`;
        } else {
            el('maxHoursInfo').textContent = '最长学时课程：暂无';
        }
    } catch (err) {
        console.error('加载统计信息失败:', err);
    }
}

// 渲染表格
function renderTable(data) {
    const tbody = el('courseTableBody');
    if (!tbody) return;

    if (data.length === 0) {
        toggleNoData(true);
        return;
    }

    tbody.innerHTML = data.map(course => {
        const courseTypeBadge = getCourseTypeBadge(course.courseType);
        const statusBadge = getStatusBadge(course.selectStatus);
        const hoursDisplay = course.hoursDisplay || `${course.theoryHours || 0}/${course.practiceHours || 0}`;

        return `
            <tr>
                <td>${course.courseNo || '-'}</td>
                <td class="text-left">
                    <span class="course-name" title="${course.courseName || '-'}">
                        ${course.courseName || '-'}
                    </span>
                </td>
                <td>${courseTypeBadge}</td>
                <td>${course.credits || 0}</td>
                <td>${hoursDisplay}</td>
                <td>${course.semesterName || '-'}</td>
                <td>${course.classTime || '-'}</td>
                <td>${course.teachers || '-'}</td>
                <td>${course.classroom || '-'}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');

    toggleNoData(false);
}

// 获取课程类型标签
function getCourseTypeBadge(type) {
    const badges = {
        '必修': '<span class="badge badge-required">必修</span>',
        '选修': '<span class="badge badge-elective">选修</span>',
        '专业核心': '<span class="badge badge-core">专业核心</span>',
        '公共基础': '<span class="badge badge-public">公共基础</span>'
    };
    return badges[type] || `<span class="badge">${type || '-'}</span>`;
}

// 获取状态标签
function getStatusBadge(status) {
    const badges = {
        '待修读': '<span class="badge badge-pending">待修读</span>',
        '已修读': '<span class="badge badge-completed">已修读</span>',
        '已结课': '<span class="badge badge-finished">已结课</span>'
    };
    return badges[status] || `<span class="badge">${status || '-'}</span>`;
}

// 排序表格
function sortTable(key) {
    if (sortState.key === key) {
        sortState.asc = !sortState.asc;
    } else {
        sortState.key = key;
        sortState.asc = true;
    }

    filteredCourses.sort((a, b) => {
        let aVal = a[key];
        let bVal = b[key];

        if (key === 'courseName') {
            aVal = a.courseName || '';
            bVal = b.courseName || '';
        } else if (key === 'courseNo') {
            aVal = a.courseNo || '';
            bVal = b.courseNo || '';
        } else if (key === 'credits') {
            aVal = a.credits || 0;
            bVal = b.credits || 0;
        } else if (key === 'hours') {
            aVal = (a.theoryHours || 0) + (a.practiceHours || 0);
            bVal = (b.theoryHours || 0) + (b.practiceHours || 0);
        } else if (key === 'semester') {
            aVal = a.semesterCode || '';
            bVal = b.semesterCode || '';
        } else if (key === 'status') {
            aVal = a.selectStatus || '';
            bVal = b.selectStatus || '';
        }

        if (typeof aVal === 'string') {
            return sortState.asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        } else {
            return sortState.asc ? aVal - bVal : bVal - aVal;
        }
    });

    renderTable(filteredCourses);
}

// 搜索课程
function searchCourses() {
    loadCoursesByPage(1);
}

// 重置筛选
function resetFilters() {
    el('semesterFilter').value = 'all';
    el('courseTypeFilter').value = 'all';
    el('keywordInput').value = '';
    loadCoursesByPage(1);
}

// 渲染分页
function renderPagination() {
    const paginationEl = el('pagination');
    if (!paginationEl) return;

    el('pageInfo').textContent = 
        `第 ${pagination.currentPage} 页，共 ${pagination.totalPages} 页，共 ${pagination.total} 条记录`;

    el('firstPageBtn').disabled = pagination.currentPage === 1;
    el('prevPageBtn').disabled = pagination.currentPage === 1;
    el('nextPageBtn').disabled = pagination.currentPage >= pagination.totalPages;
    el('lastPageBtn').disabled = pagination.currentPage >= pagination.totalPages;

    // 渲染页码按钮
    const pageNumbers = el('pageNumbers');
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        const maxPages = Math.min(pagination.totalPages, 5);
        let startPage = Math.max(1, pagination.currentPage - 2);
        let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);
        startPage = Math.max(1, endPage - maxPages + 1);

        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.className = 'page-btn';
            if (i === pagination.currentPage) {
                btn.classList.add('active');
            }
            btn.textContent = i;
            btn.onclick = () => goToPage(i);
            pageNumbers.appendChild(btn);
        }
    }
}

// 跳转页面
function goToPage(page) {
    if (page < 1 || page > pagination.totalPages) return;
    loadCoursesByPage(page);
}

function goToPrevPage() {
    goToPage(pagination.currentPage - 1);
}

function goToNextPage() {
    goToPage(pagination.currentPage + 1);
}

function goToLastPage() {
    goToPage(pagination.totalPages);
}

// 改变每页大小
function changePageSize() {
    const pageSize = parseInt(el('pageSizeSelect').value);
    pagination.pageSize = pageSize;
    loadCoursesByPage(1);
}

// 导出Excel
async function exportToExcel() {
    try {
        currentStudentNo = el('studentNoInput')?.value?.trim() || 'S2024001';
        if (!currentStudentNo) {
            alert('请输入学号');
            return;
        }

        const semesterCode = el('semesterFilter')?.value || 'all';
        const courseType = el('courseTypeFilter')?.value || 'all';
        const keyword = el('keywordInput')?.value?.trim() || '';

        // 获取所有符合条件的数据（不分页）
        const params = new URLSearchParams();
        if (semesterCode && semesterCode !== 'all') params.append('semesterCode', semesterCode);
        if (courseType && courseType !== 'all') params.append('courseType', courseType);
        if (keyword) params.append('keyword', keyword);

        const res = await fetch(`/api/courses/student/${currentStudentNo}/search?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const courses = await res.json();
        if (!Array.isArray(courses)) {
            throw new Error('返回数据格式错误');
        }

        // 生成CSV内容
        const headers = ['课程号', '课程名称', '课程类型', '学分', '理论学时', '实践学时', 
                        '开课学期', '开课时间', '授课老师', '上课地点', '选课状态', '成绩'];
        const rows = courses.map(course => [
            course.courseNo || '',
            course.courseName || '',
            course.courseType || '',
            course.credits || 0,
            course.theoryHours || 0,
            course.practiceHours || 0,
            course.semesterName || '',
            course.classTime || '',
            course.teachers || '',
            course.classroom || '',
            course.selectStatus || '',
            course.grade || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        // 添加BOM以支持中文
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        const now = new Date();
        const dateStr = now.getFullYear() + 
                       String(now.getMonth() + 1).padStart(2, '0') + 
                       String(now.getDate()).padStart(2, '0');
        link.setAttribute('download', `${currentStudentNo}_已选课程列表_${dateStr}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error('导出失败:', err);
        alert('导出失败：' + err.message);
    }
}

// 工具函数
function showLoading(show) {
    el('loading').style.display = show ? 'block' : 'none';
}

function toggleTable(show) {
    el('courseTable').style.display = show ? 'table' : 'none';
}

function toggleNoData(show, message) {
    const noData = el('noData');
    if (noData) {
        noData.style.display = show ? 'block' : 'none';
        if (message && show) {
            noData.querySelector('p').textContent = message;
        }
    }
}

function togglePagination(show) {
    el('pagination').style.display = show ? 'flex' : 'none';
}

function updateTime() {
    const now = new Date();
    const timeStr = now.getFullYear() + '-' + 
                   String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(now.getDate()).padStart(2, '0') + ' ' +
                   String(now.getHours()).padStart(2, '0') + ':' + 
                   String(now.getMinutes()).padStart(2, '0');
    el('updateTime').textContent = timeStr;
}

// 支持回车键搜索
el('keywordInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCourses();
    }
});

el('studentNoInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCourses();
    }
});

