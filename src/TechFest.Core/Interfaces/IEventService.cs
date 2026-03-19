using TechFest.Core.DTOs.Events;

namespace TechFest.Core.Interfaces;

public interface IEventService
{
    Task<List<EventDto>> GetAllEventsAsync();
    Task<EventDto?> GetEventByIdAsync(Guid id);
    Task<EventDetailDto?> GetEventDetailsWithAttendeesAsync(Guid eventId);
    Task<EventDto> CreateEventAsync(CreateEventDto dto);
    Task<EventDto?> UpdateEventAsync(Guid id, CreateEventDto dto);
    Task<bool> DeleteEventAsync(Guid id);
}
