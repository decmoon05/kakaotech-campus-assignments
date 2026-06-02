// 로컬스토리지 키
const STORAGE_KEY = "todos";

// 상태
let todos = [];
let currentFilter = "all";
let selectedDate = toDateString(new Date());
const today = toDateString(new Date());

// DOM 요소
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const message = document.getElementById("message");
const dateLabel = document.getElementById("current-date");
const emptyText = document.getElementById("empty-text");

// 날짜를 YYYY-MM-DD 문자열로 변환
function toDateString(date) {
  return date.toISOString().split("T")[0];
}

// 화면 표시용 날짜 포맷 (예: 2026년 6월 1일 월)
function formatDateLabel(dateStr) {
  const d = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}`;
}

// 로컬스토리지에서 불러오기
function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  todos = raw ? JSON.parse(raw) : [];
}

// 로컬스토리지에 저장
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 안내 메시지 표시
function showMessage(text) {
  message.textContent = text;
  setTimeout(() => {
    if (message.textContent === text) message.textContent = "";
  }, 2000);
}

// 현재 날짜 + 필터로 보여줄 todo만 골라내기
function getVisibleTodos() {
  return todos
    .filter((t) => t.date === selectedDate)
    .filter((t) => {
      if (currentFilter === "active") return !t.done;
      if (currentFilter === "done") return t.done;
      return true;
    });
}

// selectedDate가 속한 주의 월~일 7개 날짜
function getWeekDates(refDate) {
  const d = new Date(refDate);
  const day = d.getDay();   // 일=0, 월=1, ..., 토=6
  const monday = new Date(d);
  monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  const week = [];
  for (let i = 0; i < 7; i++) {
    const t = new Date(monday);
    t.setDate(monday.getDate() + i);
    week.push(toDateString(t));
  }
  return week;
}

// 특정 날짜의 todo 개수
function countByDate(dateStr) {
  return todos.filter((t) => t.date === dateStr).length;
}

// 주간 뷰 그리기
function renderWeek() {
  const week = getWeekDates(selectedDate);
  const names = ["월", "화", "수", "목", "금", "토", "일"];
  const ul = document.getElementById("week-days");
  ul.innerHTML = "";

  week.forEach((dateStr, i) => {
    const li = document.createElement("li");
    li.className = "week-day";
    if (dateStr === selectedDate) li.classList.add("selected");
    if (dateStr === today) li.classList.add("today");

    const count = countByDate(dateStr);
    li.innerHTML = `
      <div class="week-day-name">${names[i]}</div>
      <div class="week-day-num">${new Date(dateStr).getDate()}</div>
      <div class="week-day-count">${count > 0 ? count + "개" : ""}</div>
    `;
    li.addEventListener("click", () => {
      selectedDate = dateStr;
      render();
    });
    ul.appendChild(li);
  });
}

// 주 단위 이동 (7일씩)
function shiftWeek(weeks) {
  const d = new Date(selectedDate);
  d.setDate(d.getDate() + weeks * 7);
  selectedDate = toDateString(d);
  render();
}

// 화면 다시 그리기
function render() {
  renderWeek();
  dateLabel.textContent = formatDateLabel(selectedDate);
  list.innerHTML = "";

  const visible = getVisibleTodos();
  emptyText.classList.toggle("hidden", visible.length > 0);

  visible.forEach((todo) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");
    li.dataset.id = todo.id;

    const check = document.createElement("input");
    check.type = "checkbox";
    check.className = "todo-check";
    check.checked = todo.done;
    check.addEventListener("change", () => toggleDone(todo.id));

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.content;
    text.addEventListener("dblclick", () => startEdit(todo.id, text));

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.textContent = "수정";
    editBtn.addEventListener("click", () => startEdit(todo.id, text));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete";
    deleteBtn.textContent = "삭제";
    deleteBtn.addEventListener("click", () => removeTodo(todo.id));

    li.append(check, text, editBtn, deleteBtn);
    list.appendChild(li);
  });
}

// 추가
function addTodo(content) {
  const trimmed = content.trim();
  if (!trimmed) {
    showMessage("내용을 입력해주세요");
    return;
  }
  todos.push({
    id: Date.now(),
    content: trimmed,
    done: false,
    date: selectedDate,
  });
  save();
  render();
}

// 완료 토글
function toggleDone(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.done = !todo.done;
    save();
    render();
  }
}

// 삭제
function removeTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  save();
  render();
}

// 수정 시작 (텍스트를 input으로 교체)
function startEdit(id, textEl) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const editInput = document.createElement("input");
  editInput.type = "text";
  editInput.className = "todo-edit-input";
  editInput.value = todo.content;

  const finish = (commit) => {
    if (commit) {
      const newText = editInput.value.trim();
      if (newText) {
        todo.content = newText;
        save();
      }
    }
    render();
  };

  editInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") finish(true);
    if (e.key === "Escape") finish(false);
  });
  editInput.addEventListener("blur", () => finish(true));

  textEl.replaceWith(editInput);
  editInput.focus();
}

// 필터 변경
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  render();
}

// 날짜 이동
function shiftDay(days) {
  const d = new Date(selectedDate);
  d.setDate(d.getDate() + days);
  selectedDate = toDateString(d);
  render();
}

// 이벤트 바인딩
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTodo(input.value);
  input.value = "";
});

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

document.getElementById("prev-day").addEventListener("click", () => shiftDay(-1));
document.getElementById("next-day").addEventListener("click", () => shiftDay(1));

document.getElementById("prev-week").addEventListener("click", () => shiftWeek(-1));
document.getElementById("next-week").addEventListener("click", () => shiftWeek(1));

// 시작
load();
render();
