using Microsoft.EntityFrameworkCore;
using TechFest.Core.DTOs.Events;
using TechFest.Core.Entities;
using TechFest.Core.Interfaces;
using TechFest.Infrastructure.Data;

namespace TechFest.Infrastructure.Services;

public class EventService : IEventService
{
    private readonly ApplicationDbContext _context;

    public EventService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventDto>> GetAllEventsAsync()
    {
        return await _context.Events
            .OrderBy(e => e.EventDate)
            .Select(e => new EventDto
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                EventDate = e.EventDate,
                TotalSeats = e.TotalSeats,
                OccupiedSeats = e.OccupiedSeats,
                Category = e.Category,
                DurationInDays = e.DurationInDays,
                Venue = e.Venue,
                Price = e.Price,
                ImageUrl = e.ImageUrl
            })
            .ToListAsync();
    }

    public async Task<EventDto?> GetEventByIdAsync(Guid id)
    {
        var e = await _context.Events.FindAsync(id);
        if (e == null) return null;

        return new EventDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.Description,
            EventDate = e.EventDate,
            TotalSeats = e.TotalSeats,
            OccupiedSeats = e.OccupiedSeats,
            Category = e.Category,
            DurationInDays = e.DurationInDays,
            Venue = e.Venue,
            Price = e.Price,
            ImageUrl = e.ImageUrl
        };
    }

    public async Task<EventDetailDto?> GetEventDetailsWithAttendeesAsync(Guid eventId)
    {
        var ev = await _context.Events
            .Include(e => e.Registrations)
            .ThenInclude(r => r.User)
            .FirstOrDefaultAsync(e => e.Id == eventId);

        if (ev == null) return null;

        return new EventDetailDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            EventDate = ev.EventDate,
            TotalSeats = ev.TotalSeats,
            OccupiedSeats = ev.OccupiedSeats,
            Category = ev.Category,
            DurationInDays = ev.DurationInDays,
            Venue = ev.Venue,
            Price = ev.Price,
            ImageUrl = ev.ImageUrl,
            Attendees = ev.Registrations.Select(r => new AttendeeDto
            {
                UserId = r.UserId,
                UserName = r.User.FullName,
                UserEmail = r.User.Email,
                IsCheckedIn = r.IsCheckedIn,
                RegistrationDate = r.RegistrationDate,
                RegistrationId = r.Id
            }).ToList()
        };
    }

    public async Task<EventDto> CreateEventAsync(CreateEventDto dto)
    {
        var ev = new Event
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            EventDate = dto.EventDate,
            TotalSeats = dto.TotalSeats,
            OccupiedSeats = 0,
            Category = dto.Category,
            DurationInDays = dto.DurationInDays,
            Venue = dto.Venue,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl
        };

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        return new EventDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            EventDate = ev.EventDate,
            TotalSeats = ev.TotalSeats,
            OccupiedSeats = ev.OccupiedSeats,
            Category = ev.Category,
            DurationInDays = ev.DurationInDays,
            Venue = ev.Venue,
            Price = ev.Price,
            ImageUrl = ev.ImageUrl
        };
    }

    public async Task<EventDto?> UpdateEventAsync(Guid id, CreateEventDto dto)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return null;

        ev.Title = dto.Title;
        ev.Description = dto.Description;
        ev.EventDate = dto.EventDate;
        ev.TotalSeats = dto.TotalSeats;
        ev.Category = dto.Category;
        ev.DurationInDays = dto.DurationInDays;
        ev.Venue = dto.Venue;
        ev.Price = dto.Price;
        ev.ImageUrl = dto.ImageUrl;

        await _context.SaveChangesAsync();

        return new EventDto
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            EventDate = ev.EventDate,
            TotalSeats = ev.TotalSeats,
            OccupiedSeats = ev.OccupiedSeats,
            Category = ev.Category,
            DurationInDays = ev.DurationInDays,
            Venue = ev.Venue,
            Price = ev.Price,
            ImageUrl = ev.ImageUrl
        };
    }

    public async Task<bool> DeleteEventAsync(Guid id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return false;

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return true;
    }
}
