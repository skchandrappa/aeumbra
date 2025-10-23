import api from './api';
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
    
    const response = await api.get<Booking[]>(`/bookings?${params.toString()}`);
    return response.data;
  },

  async createBooking(bookingData: BookingCreate): Promise<Booking> {
    const response = await api.post<Booking>('/bookings', bookingData);
    return response.data;
  },

  async getBooking(bookingId: string): Promise<Booking> {
    const response = await api.get<Booking>(`/bookings/${bookingId}`);
    return response.data;
  },

  async updateBooking(bookingId: string, bookingData: BookingUpdate): Promise<Booking> {
    const response = await api.put<Booking>(`/bookings/${bookingId}`, bookingData);
    return response.data;
  },

  async deleteBooking(bookingId: string): Promise<void> {
    await api.delete(`/bookings/${bookingId}`);
  },

  async confirmBooking(bookingId: string): Promise<Booking> {
    const response = await api.post<Booking>(`/bookings/${bookingId}/confirm`);
    return response.data;
  },

  async cancelBooking(bookingId: string, reason?: string): Promise<Booking> {
    const response = await api.post<Booking>(`/bookings/${bookingId}/cancel`, {
      reason,
    });
    return response.data;
  },

  async completeBooking(bookingId: string, notes?: string): Promise<Booking> {
    const response = await api.post<Booking>(`/bookings/${bookingId}/complete`, {
      notes,
    });
    return response.data;
  },
};

export default bookingService;
