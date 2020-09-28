const poke_container = document.querySelector(".poke_container");
const search = document.getElementById("search");
let modal = document.querySelector(".modal");
let popup = document.querySelector(".popup");

// stores all the pokemon so I can filter them out if it matches the string the user types
let collection = [];
const pokeCache = {};

search.addEventListener("keyup", (e) => {
  e.preventDefault();
  let searchString = e.target.value.toLowerCase();
  let pokemons = collection.filter((pokemon) => {
    return (
      pokemon.name.includes(searchString) ||
      pokemon.id.toString().includes(searchString)
      // add typing as well(fighting/grass/ water etc)
    );
  });
  displayPokemon(pokemons);
});

// Load all pokemon
const fetchPokemon = async () => {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=135&offset=251";
  const res = await fetch(url);
  const data = await res.json();
  // send to global array
  collection = data.results.map((val, index) => ({
    name: val.name,
    id: index + 252,
    url: `https://pokeapi.co/api/v2/pokemon/${index + 252}/`,
    image: `https://pokeres.bastionbot.org/images/pokemon/${index + 252}.png `,
  }));

  displayPokemon(collection);
};

const displayPokemon = (pokemon) => {
  let htmlString = pokemon
    .map((poke) => {
      return `
      <div class="pokemon" onclick="selectPokemon(${poke.id})">
      
        <img class="pokeimg" src="${poke.image}">
        <p class="name">${poke.name}</p>
        <p class="id">#${poke.id}</p>
      </div>
    `;
    })
    .join("");
  poke_container.innerHTML = htmlString;
};

const selectPokemon = async (id) => {
  if (!pokeCache[id]) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    pokeCache[id] = pokemon;
    displayPopup(pokemon);
  }
  displayPopup(pokeCache[id]);
};

const displayPopup = (pokemon) => {
  const types = pokemon.types.map((type) => type.type.name).join(" ");
  const shinyImage = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.id}.png`;
  const moves = pokemon.moves.map((move) => move.move.name);

  const randomMove = (moves) => {
    let randomNumber = Math.floor(Math.random() * moves.length);
    return moves[randomNumber];
  };

  let result = randomMove(moves);
  let pokemonString = `
    <figure>
      <img src="${shinyImage}"/>
    </figure>

    <h2 class="typeHeading">Type</h2>
 
    <li class="${types}">
      ${types}
    </li>

     <h2 class="moveHeading">Random move</h2>
     <p>${result}</p>
     <a href="https://pokemondb.net/pokedex/${pokemon.name}">More info</a>

    
  `;
  modal.classList.add("open");
  popup.innerHTML = pokemonString;
};

modal.addEventListener("click", (e) => {
  const isOutside = !e.target.closest(".popup");
  isOutside ? modal.classList.remove("open") : null;
});

// Call function on reaload
window.onload = () => {
  fetchPokemon();
};
