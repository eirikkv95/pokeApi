// *get the length of the array(pokemon.length).
// *Go through all objects and find the url of that pokemon
// *call a function that takes the url as an argument
//

async function allPokemon() {
  // fetch("https://pokeapi.co/api/v2/pokemon/?offset=251&limit=135") // 135
  //   .then((res) => res.json())
  //   .then((pokemon) => {
  //     pokemon.results.forEach((pokemon) => {
  //       fetchPokemonData(pokemon);
  //     });
  //   });

  let result = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=251&limit=135"
  );
  let pokemon = await result.json();
  pokemon.results.forEach((pokemon) => {
    console.log(pokemon);
    fetchPokemonData(pokemon);
  });
}

async function fetchPokemonData(pokemon) {
  fetch(url)
    .then((res) => res.json())
    .then((pokeData) => {
      renderData(pokeData);
    });
  let url = pokemon.url;
  let result = await fetch(url);
  let pokeData = result.json();
}

function renderData(pokeData) {
  let allPokemonContainer = document.querySelector(".pokemon-container"); // main div
  let pokeContainer = document.createElement("div"); // where I want pokeImage & pokeInfo
  let pokeImgDiv = document.createElement("div");
  let pokeInfoDiv = document.createElement("div");
  let pokeName = document.createElement("h2");
  let pokeNumber = document.createElement("p");
  let pType = document.createElement("h3");
  let number = document.createElement("h3");
  let pokeTypes = document.createElement("div");
  pokeTypes.classList.add("poketype");
  pokeContainer.classList.add("pokemon");
  pokeImgDiv.classList.add("pokeImage");
  pokeInfoDiv.classList.add("pokeInfo");
  number.classList.add("number");
  pokeNumber.classList.add("pokeNumber");
  pType.classList.add("pType");
  pokeName.innerHTML = pokeData.name;
  pokeNumber.innerText = ` ${pokeData.id}`;
  pType.innerHTML = `Type`;
  number.innerHTML = `Number`;

  pokeContainer.append(pokeImgDiv, pokeInfoDiv);
  createTypes(pokeData.types, pokeTypes);
  createImage(pokeData.id, pokeImgDiv);
  pokeInfoDiv.append(pokeName, number, pType, pokeNumber, pokeTypes);

  allPokemonContainer.appendChild(pokeContainer);
  pokeContainer.addEventListener("click", () => {
    popUp(pokeNumber.innerHTML);
  });
}

// creates a image of the pokemon's id & appends the image to the pokediv
function createImage(id, pokeImageDiv) {
  let image = document.createElement("img");
  image.src = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
  pokeImageDiv.append(image);
}

// helper class. Creates a li and gives me the pokemon type(s) and adds it to the ul that is passed in
function createTypes(types, div) {
  types.forEach(function (type) {
    let typeLi = document.createElement("a");
    typeLi.classList.add(`${type["type"]["name"]}`);
    typeLi.innerText = type["type"]["name"];
    div.append(typeLi);
  });
}

function popUp(id) {
  let idNum = Number(id);
  fetch(`https://pokeapi.co/api/v2/pokemon/${idNum}/`)
    .then((res) => res.json())
    .then((pokemon) => {
      renderPopup(pokemon);
    });
}

function renderPopup(pokemon) {
  let pokemonDiv = document.querySelectorAll(".pokemon");
  let popup = document.querySelector(".popup");
  // let hpDiv = document.querySelector(".firstSection");
  let imageNormal = document.querySelector(".firstSection figure.normal img");
  let imageShiny = document.querySelector(".firstSection figure.shiny img");
  let pokemonInfo = document.querySelector(".pokemonInfo");

  imageNormal.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  imageShiny.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;
  pokemonInfo.innerHTML = `${pokemon.stats[0].base_stat}`;

  pokemonDiv.forEach((pokemon) => {
    pokemon.addEventListener("click", () => {
      popup.classList.add("open");
    });
  });
  popup.addEventListener("click", (e) => {
    if (e.target.classList.contains("popup")) {
      popup.classList.remove("open");
    }
  });
}

window.onload = () => {
  allPokemon();
};
