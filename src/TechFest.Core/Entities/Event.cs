namespace TechFest.Core.Entities;

public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int TotalSeats { get; set; }
    public int OccupiedSeats { get; set; } = 0;
    public string Category { get; set; } = "Workshop"; // "Workshop", "Hackathon", "Seminar"
    public int DurationInDays { get; set; } = 1;
    public string Venue { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    public ICollection<Registration> Registrations { get; set; } = new List<Registration>();
}
