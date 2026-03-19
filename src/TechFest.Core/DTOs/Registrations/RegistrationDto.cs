namespace TechFest.Core.DTOs.Registrations;

public class RegistrationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public string EventTitle { get; set; } = string.Empty;
    public string EventCategory { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public DateTime RegistrationDate { get; set; }
    public bool IsCheckedIn { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
}
