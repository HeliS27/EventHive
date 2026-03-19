namespace TechFest.Core.DTOs.Admin;

public class AnalyticsDto
{
    public int TotalRegistrationsToday { get; set; }
    public string MostPopularEvent { get; set; } = string.Empty;
    public double CapacityFilledPercentage { get; set; }
    public int TotalEvents { get; set; }
    public int TotalStudents { get; set; }
    public int TotalRegistrations { get; set; }
}
