import api from './api';

export interface EventItem {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  bannerUrl: string;
  galleryUrls: string[];
  videoUrl?: string;
  eventDate: string;
  venue: string;
  registrationLink?: string;
  sdgAlignment: string[];
  category: string;
  status: 'Upcoming' | 'Completed';
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  registration_count?: number;
}

interface EventsQuery {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

interface EventsResponse {
  success: boolean;
  events: EventItem[];
  pagination: {
    totalItems: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export const eventService = {
  getEvents: async (params?: EventsQuery): Promise<EventsResponse> => {
    const response = await api.get<EventsResponse>('/events', { params });
    return response.data;
  },

  getEventById: async (id: string): Promise<{ success: boolean; event: EventItem }> => {
    const response = await api.get<{ success: boolean; event: EventItem }>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (formData: FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.post<{ success: boolean; message: string; event: EventItem }>('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateEvent: async (id: string, formData: FormData): Promise<{ success: boolean; message: string; event: EventItem }> => {
    const response = await api.put<{ success: boolean; message: string; event: EventItem }>(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  deleteEvent: async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete<{ success: boolean; message: string }>(`/events/${id}`);
    return response.data;
  },

  getRegistrations: async (id: string): Promise<{ success: boolean; eventTitle: string; registrations: any[] }> => {
    const response = await api.get<{ success: boolean; eventTitle: string; registrations: any[] }>(`/events/${id}/registrations`);
    return response.data;
  },

  registerForEvent: async (id: string, data: { name: string; email: string; contact?: string }): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<{ success: boolean; message: string }>(`/events/${id}/register`, data);
    return response.data;
  }
};
