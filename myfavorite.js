const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users";
const POSTER_URL = INDEX_URL + "/";
const persons = JSON.parse(localStorage.getItem('favoritePersons'))
const dataPanel = document.querySelector('#data-panel')

//移除收藏
function removeFromFavorite(id) {

  if (!persons) return

  const personIndex = persons.findIndex((person) => person.id === id)
  if (personIndex === -1) return

  persons.splice(personIndex, 1)
  localStorage.setItem('favoritePersons', JSON.stringify(persons))

  renderPersonList(persons)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-person')) {
    showPersonModal(Number(event.target.dataset.id))  // 修改這裡
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

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
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">-</button>
            </div>
          </div>
        </div>
      </div>
  `
  });
  dataPanel.innerHTML = rawHTML;
}

renderPersonList(persons)
