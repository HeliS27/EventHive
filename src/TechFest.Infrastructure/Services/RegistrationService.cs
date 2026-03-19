using Microsoft.EntityFrameworkCore;
using TechFest.Core.DTOs.Admin;
using TechFest.Core.DTOs.Registrations;
using TechFest.Core.Entities;
using TechFest.Core.Exceptions;
using TechFest.Core.Interfaces;
using TechFest.Infrastructure.Data;

namespace TechFest.Infrastructure.Services;

public class RegistrationService : IRegistrationService
{
    private readonly ApplicationDbContext _context;

    public RegistrationService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<RegistrationDto> RegisterAsync(Guid userId, Guid eventId)
    {
        // Use a transaction to ensure atomicity
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null)
                throw new NotFoundException("Event", eventId);

            if (ev.OccupiedSeats >= ev.TotalSeats)
                throw new EventFullException();

            // Check for duplicate registration
            var existingReg = await _context.Registrations
                .AnyAsync(r => r.UserId == userId && r.EventId == eventId);
            if (existingReg)
                throw new DuplicateRegistrationException();

            // Increment occupied seats
            ev.OccupiedSeats += 1;

            // Create registration
            var registration = new Registration
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                EventId = eventId,
                RegistrationDate = DateTime.UtcNow,
                IsCheckedIn = false
            };

            _context.Registrations.Add(registration);
            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            var user = await _context.Users.FindAsync(userId);

            return new RegistrationDto
            {
                Id = registration.Id,
                UserId = registration.UserId,
                EventId = registration.EventId,
                EventTitle = ev.Title,
                EventCategory = ev.Category,
                EventDate = ev.EventDate,
                RegistrationDate = registration.RegistrationDate,
                IsCheckedIn = registration.IsCheckedIn,
                UserName = user?.FullName ?? "",
                UserEmail = user?.Email ?? ""
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> CancelRegistrationAsync(Guid userId, Guid eventId)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            var registration = await _context.Registrations
                .FirstOrDefaultAsync(r => r.UserId == userId && r.EventId == eventId);

            if (registration == null)
                throw new NotFoundException("Registration");

            var ev = await _context.Events.FindAsync(eventId);
            if (ev == null)
                throw new NotFoundException("Event", eventId);

            _context.Registrations.Remove(registration);
            ev.OccupiedSeats = Math.Max(0, ev.OccupiedSeats - 1);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<List<RegistrationDto>> GetMyRegistrationsAsync(Guid userId)
    {
        return await _context.Registrations
            .Include(r => r.Event)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.RegistrationDate)
            .Select(r => new RegistrationDto
            {
                Id = r.Id,
                UserId = r.UserId,
                EventId = r.EventId,
                EventTitle = r.Event.Title,
                EventCategory = r.Event.Category,
                EventDate = r.Event.EventDate,
                RegistrationDate = r.RegistrationDate,
                IsCheckedIn = r.IsCheckedIn,
                UserName = r.User.FullName,
                UserEmail = r.User.Email
            })
            .ToListAsync();
    }

    public async Task<bool> ToggleCheckInAsync(Guid registrationId)
    {
        var registration = await _context.Registrations.FindAsync(registrationId);
        if (registration == null) return false;

        registration.IsCheckedIn = !registration.IsCheckedIn;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<RegistrationDto>> SearchAttendeesAsync(string? search)
    {
        var query = _context.Registrations
            .Include(r => r.Event)
            .Include(r => r.User)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(r =>
                r.User.FullName.ToLower().Contains(searchLower) ||
                r.User.Email.ToLower().Contains(searchLower) ||
                r.Event.Title.ToLower().Contains(searchLower));
        }

        return await query
            .OrderByDescending(r => r.RegistrationDate)
            .Select(r => new RegistrationDto
            {
                Id = r.Id,
                UserId = r.UserId,
                EventId = r.EventId,
                EventTitle = r.Event.Title,
                EventCategory = r.Event.Category,
                EventDate = r.Event.EventDate,
                RegistrationDate = r.RegistrationDate,
                IsCheckedIn = r.IsCheckedIn,
                UserName = r.User.FullName,
                UserEmail = r.User.Email
            })
            .ToListAsync();
    }

    public async Task<AnalyticsDto> GetAnalyticsAsync()
    {
        var today = DateTime.UtcNow.Date;

        var totalRegistrationsToday = await _context.Registrations
            .CountAsync(r => r.RegistrationDate.Date == today);

        var mostPopularEvent = await _context.Events
            .OrderByDescending(e => e.OccupiedSeats)
            .Select(e => e.Title)
            .FirstOrDefaultAsync() ?? "N/A";

        var totalSeats = await _context.Events.SumAsync(e => e.TotalSeats);
        var occupiedSeats = await _context.Events.SumAsync(e => e.OccupiedSeats);
        var capacityPercentage = totalSeats > 0 ? Math.Round((double)occupiedSeats / totalSeats * 100, 1) : 0;

        var totalEvents = await _context.Events.CountAsync();
        var totalStudents = await _context.Users.CountAsync(u => u.Role == "Student");
        var totalRegistrations = await _context.Registrations.CountAsync();

        return new AnalyticsDto
        {
            TotalRegistrationsToday = totalRegistrationsToday,
            MostPopularEvent = mostPopularEvent,
            CapacityFilledPercentage = capacityPercentage,
            TotalEvents = totalEvents,
            TotalStudents = totalStudents,
            TotalRegistrations = totalRegistrations
        };
    }
}
