const apiKey = "e8476a1b";

// Search & Display Movies
if (document.getElementById("searchBtn")) {
  document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) fetchMovies(query);
  });
}

if (document.getElementById("searchInput")) {
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("searchBtn").click();
  });
}

async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(
    query
  )}`;
  const container = document.getElementById("moviesContainer");
  try {
    container.innerHTML = "<p style='text-align:center;'>Loading...</p>";
    const res = await fetch(url);
    const data = await res.json();

    if (data.Response === "True") {
      container.innerHTML = "";
      data.Search.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
        card.innerHTML = `
          <div class="movie-poster" onclick="viewDetails('${movie.imdbID}')">
            <img src="${
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/200x300?text=No+Image"
            }" alt="${movie.Title}">
          </div>
          <div class="movie-details">
            <div class="movie-title">${movie.Title}</div>
            <div class="movie-year">${movie.Year}</div>
            <button class="favorite-btn" onclick="addToFavorites('${
              movie.imdbID
            }', '${movie.Title}', '${movie.Year}', '${
          movie.Poster
        }')">⭐ Add to Favorites</button>
          </div>
        `;
        container.appendChild(card);
      });
    } else {
      container.innerHTML = `<p class="error">${data.Error}</p>`;
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p class="error">Something went wrong.</p>`;
  }
}

// View Details Page
function viewDetails(imdbID) {
  localStorage.setItem("movieID", imdbID);
  window.location.href = "movie.html";
}

// Movie Details Page
if (window.location.pathname.includes("movie.html")) {
  const imdbID = localStorage.getItem("movieID");
  const detailsContainer = document.getElementById("movieDetailsContainer");

  async function fetchMovieDetails() {
    const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}&plot=full`;
    try {
      detailsContainer.innerHTML =
        "<p style='text-align:center;'>Loading...</p>";
      const res = await fetch(url);
      const movie = await res.json();

      if (movie.Response === "True") {
        detailsContainer.innerHTML = `
          <div class="movie-card">
            <div class="movie-poster">
              <img src="${
                movie.Poster !== "N/A"
                  ? movie.Poster
                  : "https://via.placeholder.com/200x300?text=No+Image"
              }" alt="${movie.Title}">
            </div>
            <div class="movie-details">
              <div class="movie-title">${movie.Title}</div>
              <div class="movie-year">Released: ${movie.Released}</div>
              <div><strong>Genre:</strong> ${movie.Genre}</div>
              <div><strong>Director:</strong> ${movie.Director}</div>
              <div><strong>Actors:</strong> ${movie.Actors}</div>
              <div><strong>Plot:</strong> ${movie.Plot}</div>
              <button class="favorite-btn" onclick="addToFavorites('${
                movie.imdbID
              }', '${movie.Title}', '${movie.Year}', '${
          movie.Poster
        }')">⭐ Add to Favorites</button>
            </div>
          </div>
        `;
      } else {
        detailsContainer.innerHTML = `<p class="error">${movie.Error}</p>`;
      }
    } catch (err) {
      console.error(err);
      detailsContainer.innerHTML = `<p class="error">Something went wrong.</p>`;
    }
  }
  fetchMovieDetails();
}

// Favorites Page
if (window.location.pathname.includes("favorites.html")) {
  const favContainer = document.getElementById("favoritesContainer");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    favContainer.innerHTML = `<p class="error">⭐ No favorite movies yet.</p>`;
  } else {
    favorites.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("movie-card");
      card.innerHTML = `
        <div class="movie-poster" onclick="viewDetails('${movie.imdbID}')">
          <img src="${
            movie.Poster !== "N/A"
              ? movie.Poster
              : "https://via.placeholder.com/200x300?text=No+Image"
          }" alt="${movie.Title}">
        </div>
        <div class="movie-details">
          <div class="movie-title">${movie.Title}</div>
          <div class="movie-year">${movie.Year}</div>
        </div>
      `;
      favContainer.appendChild(card);
    });
  }
}

// Add to Favorites
function addToFavorites(imdbID, title, year, poster) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.find((movie) => movie.imdbID === imdbID)) {
    favorites.push({ imdbID, Title: title, Year: year, Poster: poster });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert(`⭐ "${title}" added to favorites!`);
  } else {
    alert(`⭐ "${title}" is already in favorites.`);
  }
}
