namespace TechFest.Core.Entities;

public class Registration
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid EventId { get; set; }
    public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;
    public bool IsCheckedIn { get; set; } = false;

    public User User { get; set; } = null!;
    public Event Event { get; set; } = null!;
}
