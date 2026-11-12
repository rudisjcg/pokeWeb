import { configureStore } from '@reduxjs/toolkit'
import pokeData from '../redux/reducers/getInitialPokemonData'
import modalSlice from './reducers/modalSlice'
import userSlice from './reducers/userSlice'

export const store = configureStore ({
    reducer: {
        app: pokeData,
        modals: modalSlice,
        user: userSlice

    },
})


