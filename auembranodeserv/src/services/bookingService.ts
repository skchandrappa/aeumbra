import apiService from './apiService';
import { Booking } from '../types';

export interface BookingCreate {
  event_type: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  special_requirements?: string;
  guard_id?: string;
  total_amount: number;
}

export interface BookingUpdate {
  event_type?: string;
  event_date?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  description?: string;
  special_requirements?: string;
  total_amount?: number;
}

export interface BookingService {
  getBookings: (skip?: number, limit?: number, status?: string) => Promise<Booking[]>;
  createBooking: (bookingData: BookingCreate) => Promise<Booking>;
  getBooking: (bookingId: string) => Promise<Booking>;
  updateBooking: (bookingId: string, bookingData: BookingUpdate) => Promise<Booking>;
  deleteBooking: (bookingId: string) => Promise<void>;
  confirmBooking: (bookingId: string) => Promise<Booking>;
  cancelBooking: (bookingId: string, reason?: string) => Promise<Booking>;
  completeBooking: (bookingId: string, notes?: string) => Promise<Booking>;
}

const bookingService: BookingService = {
  async getBookings(skip = 0, limit = 20, status?: string): Promise<Booking[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });
    
    if (status) params.append('status', status);
    
    const response = await apiService.get<Booking[]>(`/bookings?${params.toString()}`);
    return response;
  },

  async createBooking(bookingData: BookingCreate): Promise<Booking> {
    const response = await apiService.post<Booking>('/bookings', bookingData);
    return response;
  },

  async getBooking(bookingId: string): Promise<Booking> {
    const response = await apiService.get<Booking>(`/bookings/${bookingId}`);
    return response;
  },

  async updateBooking(bookingId: string, bookingData: BookingUpdate): Promise<Booking> {
    const response = await apiService.put<Booking>(`/bookings/${bookingId}`, bookingData);
    return response;
  },

  async deleteBooking(bookingId: string): Promise<void> {
    await apiService.delete(`/bookings/${bookingId}`);
  },

  async confirmBooking(bookingId: string): Promise<Booking> {
    const response = await apiService.post<Booking>(`/bookings/${bookingId}/confirm`);
    return response;
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const response = await apiService.post<Booking>(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response;
  },

  async completeBooking(bookingId: string, notes?: string): Promise<Booking> {
    const response = await apiService.post<Booking>(`/bookings/${bookingId}/complete`, {
      notes,
    });
    return response;
  },
};

export default bookingService;
