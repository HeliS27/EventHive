using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechFest.Core.Interfaces;

namespace TechFest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IRegistrationService _registrationService;

    public AdminController(IRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var analytics = await _registrationService.GetAnalyticsAsync();
        return Ok(analytics);
    }

    [HttpGet("attendees")]
    public async Task<IActionResult> SearchAttendees([FromQuery] string? search)
    {
        var attendees = await _registrationService.SearchAttendeesAsync(search);
        return Ok(attendees);
    }
}
