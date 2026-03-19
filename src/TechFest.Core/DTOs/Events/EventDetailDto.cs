namespace TechFest.Core.DTOs.Events;

public class AttendeeDto
{
    public Guid UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string UserEmail { get; set; } = string.Empty;
    public bool IsCheckedIn { get; set; }
    public DateTime RegistrationDate { get; set; }
    public Guid RegistrationId { get; set; }
}

public class EventDetailDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int TotalSeats { get; set; }
    public int OccupiedSeats { get; set; }
    public string Category { get; set; } = string.Empty;
    public int DurationInDays { get; set; }
    public string Venue { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsSoldOut => OccupiedSeats >= TotalSeats;
    public int AvailableSeats => TotalSeats - OccupiedSeats;
    public List<AttendeeDto> Attendees { get; set; } = new();
}
