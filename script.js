'use strict';

let students = [];

const form = document.getElementById('addForm');
const nameInput = document.getElementById('nameInput');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');
const emptyMsg = document.getElementById('emptyMsg');
const resultName = document.getElementById('resultName');
const pickBtn = document.getElementById('pickBtn');
const resetBtn = document.getElementById('resetBtn');

function addStudent(name) {
  const trimmed = name.trim();
  // 빈 이름은 추가하지 않는다
  if (!trimmed) return;

  students.push(trimmed);
  nameInput.value = '';
  renderList();
}

function removeStudent(index) {
  students.splice(index, 1);
  renderList();
}

function renderList() {
  studentList.innerHTML = '';

  students.forEach((name, index) => {
    const li = document.createElement('li');
    li.className = 'list__item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'list__item-name';
    nameSpan.textContent = name;

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'list__item-del';
    delBtn.textContent = '삭제';
    delBtn.setAttribute('aria-label', name + ' 삭제');
    delBtn.addEventListener('click', () => removeStudent(index));

    li.appendChild(nameSpan);
    li.appendChild(delBtn);
    studentList.appendChild(li);
  });

  studentCount.textContent = students.length + '명';

  // 학생이 없으면 안내 메시지를 보여준다
  emptyMsg.hidden = students.length > 0;

  // 학생이 없으면 뽑기 버튼을 비활성화한다
  pickBtn.disabled = students.length === 0;
}

function showEmptyResult() {
  resultName.classList.remove('result__name--picked', 'result__name--spinning');
  resultName.classList.add('result__name--empty');
  resultName.textContent = '등록된 학생이 없습니다.';
}

function pickPresenter() {
  // 학생이 없으면 안내 메시지를 보여준다
  if (students.length === 0) {
    showEmptyResult();
    return;
  }

  // 0.06초 간격으로 이름이 바뀌다가 멈추면 뽑힌 것이다
  let count = 0;
  const max = 12;
  resultName.classList.add('result__name--spinning');
  resultName.classList.remove('result__name--empty');

  const timer = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * students.length);
    resultName.textContent = students[randomIndex];
    count++;

    // 횟수가 다 차면 최종 발표자를 정한다
    if (count >= max) {
      clearInterval(timer);
      resultName.classList.remove('result__name--spinning');
      const finalIndex = Math.floor(Math.random() * students.length);
      resultName.textContent = students[finalIndex];
      resultName.classList.add('result__name--picked');
    }
  }, 60);
}

function resetAll() {
  // 초기화하기 전에 한 번 더 확인한다
  const ok = window.confirm('학생 목록과 발표자 결과를 모두 초기화할까요?');
  if (!ok) return;

  students = [];
  renderList();

  resultName.classList.remove('result__name--picked', 'result__name--spinning', 'result__name--empty');
  resultName.textContent = '발표자를 뽑아주세요';
}

// 폼 제출: 추가 버튼을 누르거나 입력칸에서 Enter를 치면 실행된다
form.addEventListener('submit', (event) => {
  event.preventDefault();
  addStudent(nameInput.value);
});

pickBtn.addEventListener('click', pickPresenter);
resetBtn.addEventListener('click', resetAll);

renderList();
