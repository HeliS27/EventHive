using TechFest.Core.DTOs.Admin;
using TechFest.Core.DTOs.Registrations;

namespace TechFest.Core.Interfaces;

public interface IRegistrationService
{
    Task<RegistrationDto> RegisterAsync(Guid userId, Guid eventId);
    Task<bool> CancelRegistrationAsync(Guid userId, Guid eventId);
    Task<List<RegistrationDto>> GetMyRegistrationsAsync(Guid userId);
    Task<bool> ToggleCheckInAsync(Guid registrationId);
    Task<List<RegistrationDto>> SearchAttendeesAsync(string? search);
    Task<AnalyticsDto> GetAnalyticsAsync();
}
