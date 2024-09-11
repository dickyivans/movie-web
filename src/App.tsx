import { useEffect, useState, MouseEvent } from "react";
import "./App.css";
import { getMovieList, searchMovie, getMovieDetails } from "./api";
import { UseDebounce } from "./UseDebounce";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

const App = () => {
  const [getPoputlarMovies, setPopularMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieDetails, setMovieDetails] = useState<any>(null); // Menyimpan detail film
  const [currentPage, setCurrentPage] = useState(1); // Halaman saat ini
  const [totalPages, setTotalPages] = useState(1); // Total halaman
  const debouncedSearchTerm = UseDebounce(searchTerm, 500); // 500 ms debounce

  const limitTitleLength = (title: string) => {
    if (title.length > 23) {
      return title.substring(0, 23) + "...";
    }
    return title;
  };

  const loadMovies = async (page: number) => {
    const result = await getMovieList(page);
    if (result) {
      setPopularMovies(result.results);
      setTotalPages(result.total_pages);
    }
  };

  useEffect(() => {
    loadMovies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (debouncedSearchTerm.length > 3) {
      searchMovie(debouncedSearchTerm).then((query) => {
        setPopularMovies(query.results);
        setTotalPages(query.total_pages);
      });
    } else {
      loadMovies(currentPage);
    }
  }, [debouncedSearchTerm]);

  const handleDetailsClick = async (movie: Movie) => {
    setSelectedMovie(movie);
    const details = await getMovieDetails(movie.id);
    setMovieDetails(details);
  };

  const handleClosePopup = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const handlePopupClick = (e: MouseEvent<HTMLDivElement>) => {
    // Close the popup when clicking outside of the popup content
    if (e.target === e.currentTarget) {
      handleClosePopup();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const pageNumbers = () => {
    const start = Math.max(currentPage - 2, 1);
    let end = Math.min(currentPage + 2, totalPages);

    if (end - start < 4) {
      if (start > 1) {
        end = Math.min(start + 4, totalPages);
      } else {
        end = Math.min(5, totalPages);
      }
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const PopularMoiveList = () => {
    return getPoputlarMovies.map((movie, i) => {
      return (
        <div className="Movie-wrapper" key={i}>
          <div className="Movie-image-container">
            <div className="Movie-image-wrapper">
              <img
                className="Movie-image"
                src={`${import.meta.env.VITE_BASEIMGURL}/${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
            <div className="Movie-overlay">
              <div className="Movie-rating">
                <span className="star">★</span> {movie.vote_average.toFixed(1)}{" "}
                / 10
              </div>
              <button
                className="Movie-details-button"
                onClick={() => handleDetailsClick(movie)}
              >
                View Details
              </button>
            </div>
          </div>
          <div className="Movie-title">{limitTitleLength(movie.title)}</div>
          <div className="Movie-date">{movie.release_date.split("-")[0]}</div>
        </div>
      );
    });
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <h1>
        <span>Dispart</span> Movies Mania
      </h1>
      <p>
        Welcome to Dispart Movies Mania, your go-to destination for discovering
        and exploring movies!
        <br />
        Use the search bar to quickly find movies by title, or browse through
        popular picks. Click "View Details"
        <br />
        to see in-depth information, including genre, synopsis, and ratings for
        each movie.
      </p>

      <input
        type="text"
        placeholder="Quick search"
        className="Movie-search"
        onChange={handleSearchInput}
      />
      <div className="Movie-container">
        <PopularMoiveList />
      </div>

      <div className="Pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        {pageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={currentPage === page ? "active" : ""}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages - 3 && <span>...</span>}
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {selectedMovie && movieDetails && (
        <div className="Movie-detail-popup" onClick={handlePopupClick}>
          <div className="Movie-detail-content">
            <img
              className="Movie-detail-poster"
              src={`${import.meta.env.VITE_BASEIMGURL}/${
                movieDetails.poster_path
              }`}
              alt={movieDetails.title}
            />
            <div className="Movie-detail-info">
              <h2>{movieDetails.title}</h2>
              <p>
                <strong>Genre:</strong>{" "}
                {movieDetails.genres.map((genre: any) => genre.name).join(", ")}
              </p>
              <p>
                <strong>Synopsis:</strong> {movieDetails.overview}
              </p>
              <div className="Movie-rating">
                <span className="star">★</span>{" "}
                <strong>{movieDetails.vote_average.toFixed(1)} / 10</strong>
              </div>
              <button onClick={handleClosePopup}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="Footer">
        <p>© 2024 Dispart Movies Mania. All rights reserved.</p>
      </footer>
    </>
  );
};

export default App;
