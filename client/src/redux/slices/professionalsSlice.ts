import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Professional } from '../../pages/Professionals/types';
import { getProfessionals } from '../../pages/Professionals/services/professionalsService';

interface ProfessionalsState {
  professionals: Professional[];
  loading: boolean;
  error: string | null;
  // ✅ ADD PAGINATION STATE
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

const initialState: ProfessionalsState = {
  professionals: [],
  loading: false,
  error: null,
  // ✅ PAGINATION DEFAULTS
  currentPage: 1,
  itemsPerPage: 8, // Show 8 professionals per page (2 rows of 4)
  totalItems: 0,
};

export const fetchProfessionals = createAsyncThunk(
  'professionals/fetchProfessionals',
  async () => {
    const data = await getProfessionals();
    return data;
  }
);

const professionalsSlice = createSlice({
  name: 'professionals',
  initialState,
  reducers: {
    // ✅ ADD PAGINATION ACTIONS
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProfessionals.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfessionals.fulfilled, (state, action) => {
        state.loading = false;
        state.professionals = action.payload;
        state.totalItems = action.payload.length; // ✅ SET TOTAL ITEMS
      })
      .addCase(fetchProfessionals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch professionals';
      });
  },
});

// ✅ EXPORT THE NEW ACTIONS
export const { setCurrentPage, setItemsPerPage } = professionalsSlice.actions;
export default professionalsSlice.reducer;