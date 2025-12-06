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
                        <div class="movie-card flex" data-movie='${movie.imdbID}'>
                            <img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} Poster" />
                            <div class="movie-info flex">
                                <div class="title-rating flex">
                                    <h3>${movie.Title}</h3>
                                    <p>⭐️ ${movie.Rating.slice(0, -3)}</p>
                                </div>
                                <div class="runtime-genre-watchlist-btn flex"
                                    <p>${movie.Runtime}</p>
                                    <p>${movie.Genre}</p>
                                    <button class="watchlist-btn" data-movie='${movie.imdbID}'><i class="plus-icon fa-solid fa-circle-plus" style="color: #ffffff;"></i> Watchlist</button>
                                </div>
                                <div class="plot">
                                    <p>${movie.Plot}</p>
                                </div>
                            </div>
                        </div>
                    `
            })
            document.getElementById('results-section').innerHTML = resultsHtml
    })
    searchForm.reset()
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