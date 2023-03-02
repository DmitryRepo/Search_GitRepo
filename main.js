const app = document.querySelector(".app");

const form = document.createElement("form");
form.classList.add("search");

const input = document.createElement("input");
input.classList.add("search-input");
input.setAttribute("name", "name");
input.setAttribute("autocomplete", "off");

const select = document.createElement("ul");
select.classList.add("select");

const selectData = document.createElement("div");
selectData.classList.add("data-repo");

form.appendChild(input);
form.appendChild(select);

app.appendChild(form);
app.appendChild(selectData);

input.addEventListener(
  "keyup",
  debounce(async (event) => {
    if (event.code !== "Space") {
      try {
        let response = await fetch(
          `https://api.github.com/search/repositories?q=${event.target.value}&per_page=5`
        );
        if (response.ok) {
          let responseData = await response.json();
          const selectItems = document.querySelectorAll(".select__item");
          selectItems.forEach((element) => element.remove());
          select.style.display= 'block';
          responseData.items.forEach((element) => {
            const selectItem = selectElement(element);
            selectItem.addEventListener("click", (ev) => repoElement(element));
            selectItem.removeEventListener("click", (ev) => repoElement(element));
          });
        }
      } catch (error) {
        console.log(error.name, error.message);
      }
    }
  }, 400)
);

function selectElement(element) {
  const selectItem = document.createElement("li");
  selectItem.classList.add("select__item");
  selectItem.textContent = element.name;               
  select.appendChild(selectItem);
  return selectItem;
}

function repoElement(element) {
  const dataRepo = document.createElement("div");
  dataRepo.classList.add("data-repo__item");
  selectData.appendChild(dataRepo);

  const repoItem = document.createElement("ul");
  repoItem.setAttribute(
    "style",
    "max-width:60%;list-style-type:none; margin:1rem 0;"
  );

  const repoName = document.createElement("li");
  repoName.textContent = `Name:${element.name}`;
  const repoOwner = document.createElement("li");
  repoOwner.textContent = `Owner:${element.owner.login}`;
  const repoStars = document.createElement("li");
  repoStars.textContent = `Stars:${element.stargazers_count}`;

  repoItem.appendChild(repoName);
  repoItem.appendChild(repoOwner);
  repoItem.appendChild(repoStars);

  const repoButton = document.createElement("button");
  repoButton.classList.add("btn-data");
  repoButton.textContent = "X";

  dataRepo.appendChild(repoItem);
  dataRepo.appendChild(repoButton);

  repoButton.addEventListener("click", (event) => removeButton(dataRepo));
  repoButton.removeEventListener("click", (event) => removeButton(dataRepo));
  
  input.value = '';
  select.style.display= 'none';

  return dataRepo;
}

function removeButton(dataRepo) {
  return dataRepo.remove();
}

function debounce(fn, throttleTime) {
  let time;
  return function (...args) {
    clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(this, args);
    }, throttleTime);
  };
}
