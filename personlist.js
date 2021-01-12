const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const POSTER_URL = INDEX_URL + "/";
const persons = [];
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredPersons = []
const userList = document.querySelector('#user-list')
let dataPerPage = 12
const paginator = document.querySelector('#paginator')

//加到我的最愛
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoritePersons')) || []
  const person = persons.find(person => person.id === id)

  if (list.some(person => person.id === id)) {
    return alert("此人員已加入我的最愛!")
  }
  list.push(person)

  localStorage.setItem('favoritePersons', JSON.stringify(list))
}

// 監聽Detail 產生 modal/加到我的最愛
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-person")) {
    showPersonModal(Number(event.target.dataset.id));
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
});

// Detail 產生 modal
function showPersonModal(id) {
  const modalName = document.querySelector("#person-modal-name");
  const modalAvatar = document.querySelector("#person-modal-avatar");
  const modalGender = document.querySelector("#person-modal-gender");
  const modalAge = document.querySelector("#person-modal-age");
  const modalRegion = document.querySelector("#person-modal-region");
  const modalBirthday = document.querySelector("#person-modal-birthday");
  const modalEmail = document.querySelector("#person-modal-email");

  axios.get(POSTER_URL + id).then((response) => {
    const data = response.data;
    modalName.innerText = data.name + " " + data.surname;
    modalGender.innerText = "Gender: " + data.gender;
    modalAge.innerText = "Age: " + data.age;
    modalRegion.innerText = "Region: " + data.region;
    modalBirthday.innerText = "Birthday: " + data.birthday;
    modalEmail.innerText = "Email: " + data.email;
    modalAvatar.innerHTML = `<img src="${data.avatar}" alt="..." class="img-fluid">`;
  });
}

//渲染名片資料
function renderPersonList(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
    <!-- Render Movie List -->
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${item.avatar}" class="card-img-top" alt="..." >
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-person" data-toggle="modal"
                data-target="#person-modal" data-id="${item.id}">Detail</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
  `
  });
  dataPanel.innerHTML = rawHTML;
}

//引入人員名單API/顯示分頁頁數/預設顯示第1頁
axios
  .get(INDEX_URL)
  .then((response) => {
    persons.push(...response.data.results);
    renderPaginator(persons.length)
    renderPersonList(getPersonsByPage(1));
  })
  .catch((err) => console.log(err));

//搜尋欄功能
searchForm.addEventListener('submit', function (event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  filteredPersons = persons.filter(person => person.name.toLowerCase().includes(keyword) || person.surname.toLowerCase().includes(keyword))

  if (filteredPersons.length === 0) {
    return alert("No match person!")
  }

  renderPaginator(filteredPersons.length)
  renderPersonList(getPersonsByPage(1))
})

//依頁數每頁出現12名人員
function getPersonsByPage(page) {
  const data = filteredPersons.length ? filteredPersons : persons
  const startIndex = (page - 1) * (dataPerPage)
  return data.slice(startIndex, startIndex + dataPerPage)
}

//依人員總數渲染頁數
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / dataPerPage)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

//監聽點擊分頁時,渲染相對應的人員資料
paginator.addEventListener('click', function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== 'A') return
  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  //更新畫面
  renderPersonList(getPersonsByPage(page))
})