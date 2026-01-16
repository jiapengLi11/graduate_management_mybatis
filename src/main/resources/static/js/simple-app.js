// 研究生信息管理系统前端脚本（精简版）
// 负责数据获取、表格渲染、筛选、排序、分页及导出

let students = [];
let filteredStudents = [];
let sortState = { key: 'id', asc: true };
let pagination = {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1
};

const el = (id) => document.getElementById(id);

// 初始化
window.addEventListener('DOMContentLoaded', () => {
    attachGlobalEvents();
    loadStudents();
});

function attachGlobalEvents() {
    const searchInput = el('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleFilterChange);
    }

    const majorFilter = el('majorFilter');
    const gradeFilter = el('gradeFilter');
    [majorFilter, gradeFilter].forEach((sel) => {
        if (sel) sel.addEventListener('change', handleFilterChange);
    });
}

async function loadStudents() {
    await loadStudentsByPage(1);
}

async function loadStudentsByPage(page) {
    showLoading(true);
    toggleTable(false);
    toggleNoData(false);
    togglePagination(false);

    try {
        const keyword = (el('searchInput')?.value || '').trim();
        const major = el('majorFilter')?.value || 'all';
        const grade = el('gradeFilter')?.value || 'all';
        const pageSize = pagination.pageSize;

        // 构建查询参数
        const params = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString()
        });
        if (keyword) params.append('keyword', keyword);
        if (major && major !== 'all') params.append('major', major);
        if (grade && grade !== 'all') params.append('grade', grade);

        const res = await fetch(`/api/users/page?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const result = await res.json();
        if (!result.data || !Array.isArray(result.data)) {
            throw new Error('返回数据格式错误');
        }

        students = result.data;
        filteredStudents = [...students];

        // 更新分页信息
        pagination.currentPage = result.page || page;
        pagination.pageSize = result.pageSize || pageSize;
        pagination.total = result.total || 0;
        pagination.totalPages = result.totalPages || 1;

        // 计算统计信息（需要所有数据，所以先获取全部数据用于统计）
        await loadStatsData(keyword, major, grade);

        renderTable(filteredStudents);
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

async function loadStatsData(keyword, major, grade) {
    try {
        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (major && major !== 'all') params.append('major', major);
        if (grade && grade !== 'all') params.append('grade', grade);

        const res = await fetch(`/api/users/search?${params.toString()}`);
        if (res.ok) {
            const allData = await res.json();
            if (Array.isArray(allData)) {
                renderStats(allData);
            }
        }
    } catch (err) {
        console.error('加载统计信息失败:', err);
    }
}

function handleFilterChange() {
    // 重置到第一页并重新加载
    pagination.currentPage = 1;
    loadStudentsByPage(1);
}

function searchStudents() {
    handleFilterChange();
}

function filterTable() {
    handleFilterChange();
}

function sortTable(key) {
    if (sortState.key === key) {
        sortState.asc = !sortState.asc;
    } else {
        sortState = { key, asc: true };
    }
    // 分页模式下，排序需要重新从服务器加载数据
    // 这里暂时使用客户端排序
    applySort();
    renderTable(filteredStudents);
}

function applySort() {
    const { key, asc } = sortState;
    filteredStudents.sort((a, b) => {
        const v1 = a?.[key];
        const v2 = b?.[key];

        if (typeof v1 === 'number' && typeof v2 === 'number') {
            return asc ? v1 - v2 : v2 - v1;
        }
        const s1 = (v1 ?? '').toString();
        const s2 = (v2 ?? '').toString();
        return asc ? s1.localeCompare(s2) : s2.localeCompare(s1);
    });
}

function renderTable(list) {
    const tbody = el('studentTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    list.forEach((s) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="student-id">${safe(s.id)}</td>
            <td>${safe(s.name)}</td>
            <td>${safe(s.studentId)}</td>
            <td>${renderGender(s.gender)}</td>
            <td>${safe(s.age)}</td>
            <td>${safe(s.major)}</td>
            <td>${safe(s.advisor)}</td>
            <td>${renderGrade(s.grade)}</td>
            <td>${renderGpa(s.gpa)}</td>
            <td>${renderStatus(s.status)}</td>
            <td class="actions">
                <button onclick="showDetail(${safe(s.id)})">详情</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderStats(list) {
    el('totalStudents').innerText = list.length;

    const ages = list.map((s) => Number(s.age)).filter((n) => !isNaN(n));
    const gpas = list.map((s) => Number(s.gpa)).filter((n) => !isNaN(n));

    el('avgAge').innerText = ages.length
        ? (ages.reduce((a, b) => a + b, 0) / ages.length).toFixed(1)
        : '0';
    el('avgGpa').innerText = gpas.length
        ? (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2)
        : '0.00';

    const maleCount = list.filter((s) => s.gender === '男').length;
    const femaleCount = list.filter((s) => s.gender === '女').length;
    el('maleCount').innerText = maleCount;
    el('femaleCount').innerText = femaleCount;
}

function showDetail(id) {
    const student = students.find((s) => String(s.id) === String(id));
    if (!student) return;

    const modal = el('detailModal');
    const content = el('detailContent');
    const title = el('detailTitle');

    title.innerText = `${safe(student.name)} 的详情`;
    content.innerHTML = `
        <p><strong>学号：</strong>${safe(student.studentId)}</p>
        <p><strong>用户名：</strong>${safe(student.username)}</p>
        <p><strong>年龄：</strong>${safe(student.age)}</p>
        <p><strong>性别：</strong>${safe(student.gender)}</p>
        <p><strong>专业：</strong>${safe(student.major)}</p>
        <p><strong>导师：</strong>${safe(student.advisor)}</p>
        <p><strong>年级：</strong>${safe(student.grade)}</p>
        <p><strong>状态：</strong>${safe(student.status)}</p>
        <p><strong>入学日期：</strong>${safe(student.enrollmentDate)}</p>
        <p><strong>预计毕业：</strong>${safe(student.expectedGraduation)}</p>
        <p><strong>GPA：</strong>${safe(student.gpa)}</p>
        <p><strong>更新时间：</strong>${safe(student.updateTime)}</p>
        <p><strong>邮箱：</strong>${safe(student.email)}</p>
        <p><strong>电话：</strong>${safe(student.phone)}</p>
    `;

    modal.style.display = 'flex';
    modal.onclick = (e) => {
        if (e.target === modal) closeDetailModal();
    };
}

function closeDetailModal() {
    const modal = el('detailModal');
    modal.style.display = 'none';
}

function renderGender(gender) {
    const isMale = gender === '男';
    const cls = isMale ? 'gender-badge gender-male' : 'gender-badge gender-female';
    return `<span class="${cls}">${safe(gender)}</span>`;
}

function renderGrade(grade) {
    const map = { '研一': 'grade-1', '研二': 'grade-2', '研三': 'grade-3' };
    const cls = map[grade] || '';
    return `<span class="grade-badge ${cls}">${safe(grade)}</span>`;
}

function renderStatus(status) {
    const map = {
        '在读': 'status-reading',
        '毕业': 'status-graduation',
        '实习': 'status-intern',
        '休学': 'status-suspension'
    };
    const cls = map[status] || 'status-reading';
    return `<span class="status-badge ${cls}">${safe(status)}</span>`;
}

function renderGpa(gpa) {
    const num = Number(gpa);
    const val = isNaN(num) ? '0.00' : num.toFixed(2);
    return `<span class="gpa-badge">${val}</span>`;
}

async function exportData() {
    try {
        // 获取所有符合条件的数据用于导出
        const keyword = (el('searchInput')?.value || '').trim();
        const major = el('majorFilter')?.value || 'all';
        const grade = el('gradeFilter')?.value || 'all';

        const params = new URLSearchParams();
        if (keyword) params.append('keyword', keyword);
        if (major && major !== 'all') params.append('major', major);
        if (grade && grade !== 'all') params.append('grade', grade);

        const res = await fetch(`/api/users/search?${params.toString()}`);
        if (!res.ok) {
            alert('导出失败：无法获取数据');
            return;
        }

        const allData = await res.json();
        if (!Array.isArray(allData) || allData.length === 0) {
            alert('无数据可导出');
            return;
        }

        const headers = [
            'ID', '用户名', '学号', '姓名', '年龄', '性别', '邮箱', '电话',
            '专业', '导师', '年级', '状态', '入学日期', '预计毕业', 'GPA', '更新时间'
        ];

        const rows = allData.map((s) => [
            s.id, s.username, s.studentId, s.name, s.age, s.gender, s.email, s.phone,
            s.major, s.advisor, s.grade, s.status, s.enrollmentDate,
            s.expectedGraduation, s.gpa, s.updateTime
        ]);

        const csv = [headers, ...rows]
            .map((r) => r.map(csvEscape).join(','))
            .join('\r\n');

        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `研究生信息_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    } catch (err) {
        console.error('导出失败:', err);
        alert('导出失败：' + err.message);
    }
}

function csvEscape(val) {
    const str = val == null ? '' : String(val);
    if (/[",\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function updateTime() {
    const elUpdate = el('updateTime');
    if (!elUpdate) return;
    const now = new Date();
    const pad = (n) => (n < 10 ? `0${n}` : n);
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
        `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    elUpdate.innerText = ts;
}

function toggleTable(show) {
    const table = el('studentTable');
    if (table) table.style.display = show ? 'table' : 'none';
}

function showLoading(show) {
    const loading = el('loading');
    if (loading) loading.style.display = show ? 'block' : 'none';
}

function toggleNoData(show, message) {
    const noData = el('noData');
    if (noData) {
        noData.style.display = show ? 'block' : 'none';
        const p = noData.querySelector('p');
        if (p && message) p.innerText = message;
    }
}

function safe(val) {
    if (val === null || val === undefined) return '';
    return String(val);
}

// 分页相关函数
function goToPage(page) {
    if (page < 1 || page > pagination.totalPages) return;
    loadStudentsByPage(page);
}

function goToPrevPage() {
    if (pagination.currentPage > 1) {
        goToPage(pagination.currentPage - 1);
    }
}

function goToNextPage() {
    if (pagination.currentPage < pagination.totalPages) {
        goToPage(pagination.currentPage + 1);
    }
}

function goToLastPage() {
    goToPage(pagination.totalPages);
}

function changePageSize() {
    const pageSizeSelect = el('pageSizeSelect');
    if (pageSizeSelect) {
        pagination.pageSize = parseInt(pageSizeSelect.value);
        pagination.currentPage = 1;
        loadStudentsByPage(1);
    }
}

function renderPagination() {
    const paginationEl = el('pagination');
    const pageInfo = el('pageInfo');
    const pageNumbers = el('pageNumbers');
    const firstPageBtn = el('firstPageBtn');
    const prevPageBtn = el('prevPageBtn');
    const nextPageBtn = el('nextPageBtn');
    const lastPageBtn = el('lastPageBtn');

    if (!paginationEl) return;

    // 更新分页信息
    if (pageInfo) {
        const start = pagination.total === 0 ? 0 : (pagination.currentPage - 1) * pagination.pageSize + 1;
        const end = Math.min(pagination.currentPage * pagination.pageSize, pagination.total);
        pageInfo.textContent = `第 ${pagination.currentPage} 页，共 ${pagination.totalPages} 页，共 ${pagination.total} 条记录（显示 ${start}-${end} 条）`;
    }

    // 更新按钮状态
    if (firstPageBtn) firstPageBtn.disabled = pagination.currentPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = pagination.currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = pagination.currentPage >= pagination.totalPages;
    if (lastPageBtn) lastPageBtn.disabled = pagination.currentPage >= pagination.totalPages;

    // 生成页码按钮
    if (pageNumbers) {
        pageNumbers.innerHTML = '';
        const currentPage = pagination.currentPage;
        const totalPages = pagination.totalPages;

        // 计算显示的页码范围
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);

        // 如果接近开头，显示更多后面的页码
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        }
        // 如果接近结尾，显示更多前面的页码
        if (currentPage >= totalPages - 2) {
            startPage = Math.max(1, totalPages - 4);
        }

        // 添加第一页和省略号
        if (startPage > 1) {
            const btn = createPageButton(1);
            pageNumbers.appendChild(btn);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 5px';
                ellipsis.style.color = '#666';
                pageNumbers.appendChild(ellipsis);
            }
        }

        // 添加页码按钮
        for (let i = startPage; i <= endPage; i++) {
            const btn = createPageButton(i);
            if (i === currentPage) {
                btn.classList.add('active');
            }
            pageNumbers.appendChild(btn);
        }

        // 添加最后一页和省略号
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.style.padding = '0 5px';
                ellipsis.style.color = '#666';
                pageNumbers.appendChild(ellipsis);
            }
            const btn = createPageButton(totalPages);
            pageNumbers.appendChild(btn);
        }
    }

    // 更新每页大小选择器
    const pageSizeSelect = el('pageSizeSelect');
    if (pageSizeSelect) {
        pageSizeSelect.value = pagination.pageSize.toString();
    }
}

function createPageButton(pageNum) {
    const btn = document.createElement('button');
    btn.className = 'page-btn';
    btn.textContent = pageNum.toString();
    btn.onclick = () => goToPage(pageNum);
    return btn;
}

function togglePagination(show) {
    const paginationEl = el('pagination');
    if (paginationEl) {
        paginationEl.style.display = show && pagination.total > 0 ? 'flex' : 'none';
    }
}

