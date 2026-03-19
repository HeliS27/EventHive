namespace TechFest.Core.DTOs.Events;

public class CreateEventDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime EventDate { get; set; }
    public int TotalSeats { get; set; }
    public string Category { get; set; } = "Workshop";
    public int DurationInDays { get; set; } = 1;
    public string Venue { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
}
