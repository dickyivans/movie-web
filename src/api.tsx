import axios from "axios";

// Fungsi untuk mendapatkan daftar film dengan pagination
export const getMovieList = async (page: number = 1) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASEURL}/movie/popular?page=${page}&api_key=${
        import.meta.env.VITE_APIKEY
      }`
    );
    console.log({ movieList: response });
    return response.data; // Mengembalikan data film
  } catch (error) {
    console.error("Error fetching movie list:", error);
    return null;
  }
};

// Fungsi untuk mencari film berdasarkan query
export const searchMovie = async (q: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASEURL}/search/movie?query=${q}&api_key=${
        import.meta.env.VITE_APIKEY
      }`
    );
    return response.data; // Mengembalikan hasil pencarian
  } catch (error) {
    console.error("Error searching for movie:", error);
    return null;
  }
};

// Fungsi untuk mendapatkan detail film berdasarkan ID
export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BASEURL}/movie/${movieId}?api_key=${
        import.meta.env.VITE_APIKEY
      }`
    );
    return response.data; // Mengembalikan data detail film
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
