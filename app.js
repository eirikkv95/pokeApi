async function allPokemon() {
  let result = await fetch(
    "https://pokeapi.co/api/v2/pokemon/?offset=251&limit=135" // 135
  );
  let pokemon = await result.json();
  await pokemon.results.forEach((pokemon) => {
    fetchPokemonData(pokemon);
  });
}

async function fetchPokemonData(pokemon) {
  let result = await fetch(pokemon.url);
  let pokeData = await result.json();
  renderData(pokeData);
}

function renderData(pokeData) {
  let pokemonDiv = document.querySelector(".pokemon-container");
  let pokemon = document.createElement("div");
  let heading2 = document.createElement("h2");
  let spans = document.createElement("span");
  let pokeUl = document.createElement("ul");

  pokeUl.classList.add("ul");
  spans.classList.add("btn");
  pokemon.classList.add("pokemon");
  heading2.innerText = `${pokeData.name}`;

  createImage(pokeData.id, pokemon);
  createTypes(pokeData.types, pokeUl);
  pokemon.append(heading2, pokeUl);
  pokemonDiv.append(pokemon);
  pokemon.addEventListener("click", (e) => {
    popUp(pokeData.id);
  });
}

function createTypes(types, ul) {
  types.forEach(function (type) {
    let typeLi = document.createElement("li");
    typeLi.classList.add(`${type.type.name}`);
    console.log(type.type.name);
    typeLi.innerText = type["type"]["name"];
    ul.append(typeLi);
  });
}
//? creates a image of the pokemon's id & appends the image to the pokediv
function createImage(id, pokemon) {
  let image = document.createElement("img");
  image.src = `https://pokeres.bastionbot.org/images/pokemon/${id}.png`;
  pokemon.append(image);
}

async function popUp(id) {
  let idNum = Number(id);
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${idNum}/`);
  let data = await response.json();
  renderPopup(data);
}

const renderPopup = (pokemon) => {
  let pokemonDiv = document.querySelectorAll(".pokemon");
  let popup = document.querySelector(".popup");
  let imageNormal = document.querySelector(".firstSection figure.normal img");
  let imageShiny = document.querySelector(".firstSection figure.shiny img");

  pokemonStat(pokemon).then((res) => {
    createInfo(res);
  });

  imageNormal.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;
  imageShiny.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`;

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
};

const pokemonStat = async (pokemon) => {
  let url = pokemon.species.url;
  let pokeInfo = await fetch(url);
  let result = await pokeInfo.json();

  return result;
};

const createInfo = (res) => {
  let pokemonInfo = document.querySelector(".pokemonInfo");
  for (let i = 0; i < res.flavor_text_entries.length; i++) {
    if (res.flavor_text_entries[i].language.name === "en") {
      pokemonInfo.innerText = `${res.flavor_text_entries[i].flavor_text}`;
    }
  }
};

window.onload = () => {
  allPokemon();
};
