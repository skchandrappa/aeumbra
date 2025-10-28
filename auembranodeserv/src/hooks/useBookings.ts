import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Booking, BookingCreate, BookingUpdate } from '../types';
import bookingService from '../services/bookingService';

export const useBookings = (skip = 0, limit = 20, status?: string) => {
  return useQuery(
    ['bookings', skip, limit, status],
    () => bookingService.getBookings(skip, limit, status),
    {
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );
};

export const useBooking = (bookingId: string) => {
  return useQuery(
    ['booking', bookingId],
    () => bookingService.getBooking(bookingId),
    {
      enabled: !!bookingId,
    }
  );
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (bookingData: BookingCreate) => bookingService.createBooking(bookingData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
      },
    }
  );
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ bookingId, bookingData }: { bookingId: string; bookingData: BookingUpdate }) =>
      bookingService.updateBooking(bookingId, bookingData),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['bookings']);
        queryClient.invalidateQueries(['booking', variables.bookingId]);
      },
    }
  );
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (bookingId: string) => bookingService.deleteBooking(bookingId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings']);
      },
    }
  );
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    (bookingId: string) => bookingService.confirmBooking(bookingId),
    {
      onSuccess: (data, bookingId) => {
        queryClient.invalidateQueries(['bookings']);
        queryClient.invalidateQueries(['booking', bookingId]);
      },
    }
  );
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ bookingId, reason }: { bookingId: string; reason?: string }) =>
      bookingService.cancelBooking(bookingId, reason),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['bookings']);
        queryClient.invalidateQueries(['booking', variables.bookingId]);
      },
    }
  );
};

export const useCompleteBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    ({ bookingId, notes }: { bookingId: string; notes?: string }) =>
      bookingService.completeBooking(bookingId, notes),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(['bookings']);
        queryClient.invalidateQueries(['booking', variables.bookingId]);
      },
    }
  );
};
