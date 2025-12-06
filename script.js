const searchForm = document.getElementById('search-form')

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const searchFormData = new FormData(searchForm)
    const searchFormDataObj = Object.fromEntries(searchFormData.entries())
    let resultsHtml = ``
    fetch(`http://www.omdbapi.com/?apikey=44d7feb2&s=${searchFormDataObj.title}`)
        .then(response => response.json())
        .then( async data => {
            const movieDetails = await Promise.all(data.Search.map(getMovieDetails))
            movieDetails.forEach(movie => {
                resultsHtml += `
                        <div class="movie-card">
                            <img src="${movie.Poster}" alt="${movie.Title} Poster" />
                            <div class="movie-info">
                                <div class="title-rating">
                                    <h3>${movie.Title}</h3>
                                    <p>⭐️${movie.imdbRating}</p>
                                </div>
                                <div class="runtime-genre-watchlist-btn"
                                <p>${movie.Year}</p>
                            </div>
                        </div>
                    `
            })
    })

async function getMovieDetails(movie) {
    const response = await fetch(`http://www.omdbapi.com/?apikey=44d7feb2&i=${movie.imdbID}`)
    const data = await response.json()
    return {
        Poster: data.Poster,
        Title: data.Title,
        Rating: data.Ratings[0].Value,
        Runtime: data.Runtime,
        Genre: data.Genre,
        Plot: data.Plot
    }
}