const pokeLista = document.querySelector(".poke-list");
const pokeDetalles = document.querySelector(".poke-details");
let currentPage = 1;
const pokemonsPerPage = 20;
let listaCompleta = [];
let listaActual = [];

async function pedirPokemonData(pokemonName) {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

function mostrarDetallesPokemon(pokemon) {
  pokeDetalles.innerHTML = `
    <h2 class="nameCard nam">${pokemon.name}</h2>
    <p class="nameCard num">Número de Pokédex:#${pokemon.id}</p>
    <img class="poke-image" src="${pokemon.sprites.front_default}" alt="${
    pokemon.name
  }">
    <p>Altura: ${pokemon.height / 10} m</p>
    <p>Peso: ${pokemon.weight / 10} kg</p>
    <p>Tipo(s): ${pokemon.types.map((type) => type.type.name).join(", ")}</p>
    <p>Habilidades: ${pokemon.abilities
      .map((ability) => ability.ability.name)
      .join(", ")}</p>
  `;

  const detallesPokemon = document.getElementById("poke-details");

  detallesPokemon.scrollIntoView({ behavior: "smooth" });
}

async function obtenerListaCompletaPokemon() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1000"
    );
    const data = await response.json();
    listaCompleta = data.results;
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

function actualizarListaActual() {
  const IdxInicial = (currentPage - 1) * pokemonsPerPage;
  const IdxFinal = IdxInicial + pokemonsPerPage;
  listaActual = listaCompleta.slice(IdxInicial, IdxFinal);
}

async function mostrarListaPokemon() {
  try {
    actualizarListaActual();

    pokeLista.innerHTML = "";
    for (const pokemon of listaActual) {
      const pokemonData = await pedirPokemonData(pokemon.name);
      const pokeCard = document.createElement("div");
      pokeCard.className = "poke-card";
      pokeCard.innerHTML = `
        <p class="namePoke">${pokemon.name}</p>
        <img class="poke-image" src="${
          pokemonData.sprites.front_default
        }" alt="${pokemon.name}">
        <p class="poke-number">#${listaCompleta.indexOf(pokemon) + 1}</p>
      `;
      pokeCard.addEventListener("click", () =>
        mostrarDetallesPokemon(pokemonData)
      );
      pokeLista.appendChild(pokeCard);
    }
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

async function buscarPokemon() {
  const searchInput = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const foundPokemon = listaCompleta.find(
    (pokemon) =>
      pokemon.name.toLowerCase() === searchInput ||
      String(listaCompleta.indexOf(pokemon) + 1) === searchInput
  );

  if (foundPokemon) {
    const pageIndex = Math.floor(
      listaCompleta.indexOf(foundPokemon) / pokemonsPerPage
    );

    currentPage = pageIndex + 1;
    const positionInPage =
      listaCompleta.indexOf(foundPokemon) % pokemonsPerPage;
    listaActual.unshift(foundPokemon);
    listaActual.splice(positionInPage, 0, listaActual.pop());

    const pokemonData = await pedirPokemonData(foundPokemon.name);
    mostrarDetallesPokemon(pokemonData);
    mostrarListaPokemon();
  } else {
    pokeDetalles.innerHTML =
      "<p>No se encontró ningún Pokémon con ese nombre o número de Pokédex.</p>";
  }
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function irAPaginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    mostrarListaPokemon();
    scrollToTop();
  }
}

function irAPaginaSiguiente() {
  currentPage++;
  mostrarListaPokemon();
  scrollToTop();
}

document.addEventListener("DOMContentLoaded", () => {
  obtenerListaCompletaPokemon().then(() => mostrarListaPokemon());
});
