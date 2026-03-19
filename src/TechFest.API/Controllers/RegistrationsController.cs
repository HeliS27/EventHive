using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechFest.Core.DTOs.Registrations;
using TechFest.Core.Interfaces;

namespace TechFest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RegistrationsController : ControllerBase
{
    private readonly IRegistrationService _registrationService;

    public RegistrationsController(IRegistrationService registrationService)
    {
        _registrationService = registrationService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Register([FromBody] CreateRegistrationDto dto)
    {
        var userId = GetUserId();
        var result = await _registrationService.RegisterAsync(userId, dto.EventId);
        return Ok(result);
    }

    [HttpDelete("{eventId}")]
    [Authorize]
    public async Task<IActionResult> CancelRegistration(Guid eventId)
    {
        var userId = GetUserId();
        await _registrationService.CancelRegistrationAsync(userId, eventId);
        return Ok(new { message = "Registration cancelled successfully." });
    }

    [HttpGet("my-events")]
    [Authorize]
    public async Task<IActionResult> GetMyEvents()
    {
        var userId = GetUserId();
        var registrations = await _registrationService.GetMyRegistrationsAsync(userId);
        return Ok(registrations);
    }

    [HttpPatch("{id}/checkin")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ToggleCheckIn(Guid id)
    {
        var result = await _registrationService.ToggleCheckInAsync(id);
        if (!result) return NotFound(new { message = "Registration not found." });
        return Ok(new { message = "Check-in status toggled." });
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }
}
