const app = document.querySelector(".app");

const form = document.createElement("form");
form.classList.add("search");

const input = document.createElement("input");
input.classList.add("search-input");
input.setAttribute("name", "name");

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
    if (event.target.value.lenght == 0) {
      let selectItems = document.querySelectorAll(".select__item");
      selectItems.forEach((item) => item.remove());
    } else {
      select.innerHTML = "";

      fetch(
        `https://api.github.com/search/repositories?q=${event.target.value}&per_page=5`
      ).then((response) => {
        if (response.ok) {
          response.json()
          .then((data) => {
            let selectItems = document.querySelectorAll(".select__item");
            selectItems.forEach((element) => element.remove());

            data.items.forEach((element) => {
              let selectItems = document.createElement("li");
              selectItems.classList.add("select__item");

              selectItems.addEventListener("click", (data) => {
                let dataRepo = document.createElement("div");
                dataRepo.classList.add("data-repo__item");
                selectData.appendChild(dataRepo);

                let repoItem = document.createElement("ul");
                repoItem.setAttribute(
                  "style",
                  "max-width:60%;list-style-type:none;"
                ); 
                let repoName = document.createElement("li")
                repoName.textContent = `Name:${element.name}`
                let repoOwner = document.createElement("li")
                repoOwner.textContent = `Owner:${element.owner.login}`
                let repoStars = document.createElement("li")
                repoStars.textContent = `Stars:${element.stargazers_count}`
                repoItem.appendChild(repoName);
                repoItem.appendChild(repoOwner);
                repoItem.appendChild(repoStars);
              
                let buttonData = document.createElement("button");
                buttonData.classList.add("btn-data");
                buttonData.textContent = 'X';

                dataRepo.appendChild(repoItem);
                dataRepo.appendChild(buttonData);

                buttonData.addEventListener("click", (event) =>
                  dataRepo.remove()
                );
                 
              });

              selectItems.textContent = element.name;
              select.appendChild(selectItems);
            });
          });
        }
      });
    }
  },400)
);

function debounce(fn, throttleTime) {
  let time;
  return function (...args) {
    clearTimeout(time);
    time = setTimeout(() => {
      fn.apply(this, args);
    }, throttleTime);
  };
}

