import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { pokemonsRoute } from "../../constants";
import axios from "axios";



export const getInitialPokemonData = createAsyncThunk (
    "pokemon/initialData",
    async () => {
        try {
            const {data} = await axios.get(pokemonsRoute)
            return data.results;
        } catch(err) {
            console.log(err);
        }
    }
)

export const pokeData = createSlice({
    name: "pokeData",
    initialState: {
      pokeList: [],
      loading: false,
      error: null,
    },
    extraReducers: {
      [getInitialPokemonData.pending] : (state, ) => {
          state.loading = true;
      },
      [getInitialPokemonData.fulfilled] : (state, action ) => {
          state.loading = false;
          state.pokeList = action.payload;
      },
      [getInitialPokemonData.rejected] : (state, action) => {
          state.loading = false;
          state.error = action.payload
      }
    }
  });

  export default pokeData.reducer;