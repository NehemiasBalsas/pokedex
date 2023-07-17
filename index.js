const pokeLista = document.querySelector(".poke-list");
const pokeDetalles = document.querySelector(".poke-details");
let currentPage = 1;
const pokemonsPerPage = 20;

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
    <h2>${pokemon.name}</h2>
    <p>Número de Pokédex: ${pokemon.id}</p>
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
}
let listaCompleta = []; 

async function obtenerListaCompletaPokemon() {
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=1000"
    );
    const data = await response.json();
    listaCompleta = data.results;

    mostrarListaPokemon();
  } catch (error) {
    console.error("Error al obtener los datos:", error);
  }
}

async function mostrarListaPokemon() {
  try {
    const IdxInicial = (currentPage - 1) * pokemonsPerPage;
    const IdxFinal = IdxInicial + pokemonsPerPage;
    const listaActual = listaCompleta.slice(IdxInicial, IdxFinal);

    pokeLista.innerHTML = "";
    for (const pokemon of listaActual) {
      const pokemonData = await pedirPokemonData(pokemon.name);
      const pokeCard = document.createElement("div");
      pokeCard.className = "poke-card";
      pokeCard.innerHTML = `
        <p>${pokemon.name}</p>
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

function irAPaginaAnterior() {
  if (currentPage > 1) {
    currentPage--;
    mostrarListaPokemon();
  }
}

function irAPaginaSiguiente() {
  currentPage++;
  mostrarListaPokemon();
}


obtenerListaCompletaPokemon();