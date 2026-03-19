using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TechFest.Core.DTOs.Events;
using TechFest.Core.Interfaces;
using TechFest.Infrastructure.Data;

namespace TechFest.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly ApplicationDbContext _context;
    private readonly IWebHostEnvironment _env;

    public EventsController(IEventService eventService, ApplicationDbContext context, IWebHostEnvironment env)
    {
        _eventService = eventService;
        _context = context;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var events = await _eventService.GetAllEventsAsync();
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var ev = await _eventService.GetEventByIdAsync(id);
        if (ev == null) return NotFound(new { message = "Event not found." });
        return Ok(ev);
    }

    [HttpGet("{id}/details")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetEventDetails(Guid id)
    {
        var ev = await _eventService.GetEventDetailsWithAttendeesAsync(id);
        if (ev == null) return NotFound(new { message = "Event not found." });
        return Ok(ev);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateEventDto dto, IFormFile? image)
    {
        if (image != null && image.Length > 0)
        {
            var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
            var filePath = Path.Combine(uploadsDir, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            dto.ImageUrl = $"/uploads/{fileName}";
        }
        var ev = await _eventService.CreateEventAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = ev.Id }, ev);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, [FromBody] CreateEventDto dto)
    {
        var ev = await _eventService.UpdateEventAsync(id, dto);
        if (ev == null) return NotFound(new { message = "Event not found." });
        return Ok(ev);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _eventService.DeleteEventAsync(id);
        if (!result) return NotFound(new { message = "Event not found." });
        return NoContent();
    }

    [HttpPost("{id}/upload-image")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UploadImage(Guid id, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound(new { message = "Event not found." });

        var uploadsDir = Path.Combine(_env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot"), "uploads");
        if (!Directory.Exists(uploadsDir))
            Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        ev.ImageUrl = $"http://localhost:5000/uploads/{fileName}";
        await _context.SaveChangesAsync();

        return Ok(new { imageUrl = ev.ImageUrl });
    }
}
