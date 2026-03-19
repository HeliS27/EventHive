using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TechFest.Core.Interfaces;
using TechFest.Infrastructure.Data;
using TechFest.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Removed Swagger due to .NET 9 incompatibility

// Database - SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")
        ?? "Data Source=techfest.db;Pooling=False;"));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "TechFestSuperSecretKey2024!@#$%^&*()_+";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "TechFestAPI";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "TechFestApp";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();

// Dependency Injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IRegistrationService, RegistrationService>();

// CORS - Allow Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Ensure database is created and seeded
// using (var scope = app.Services.CreateScope())
// {
//     var services = scope.ServiceProvider;
//     try
//     {
//         var db = services.GetRequiredService<ApplicationDbContext>();
//         // db.Database.Migrate();
//         // SeedData(db).GetAwaiter().GetResult();
//     }
//     catch (Exception ex)
//     {
//         var logger = services.GetRequiredService<ILogger<Program>>();
//         logger.LogError(ex, "An error occurred while migrating or seeding the database.");
//         throw;
//     }
// }

// Middleware pipeline
    // Swagger removed

app.UseMiddleware<TechFest.API.Middleware.GlobalExceptionMiddleware>();
app.UseStaticFiles(); // Serve all static files from wwwroot, including /uploads
// Removed custom StaticFileOptions for /uploads
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

// Seed method
static async Task SeedData(ApplicationDbContext db)
{
    if (await db.Users.AnyAsync()) return; // Already seeded

    // Seed Admin user
    var admin = new TechFest.Core.Entities.User
    {
        Id = Guid.NewGuid(),
        FullName = "Admin User",
        Email = "admin@techfest.com",
        Role = "Admin",
        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123")
    };
    db.Users.Add(admin);

    // Seed sample events
    var events = new[]
    {
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "Web Development with React",
            Description = "Learn modern web development using React.js, including hooks, state management, and component design patterns.",
            EventDate = DateTime.UtcNow.AddDays(7),
            TotalSeats = 50,
            OccupiedSeats = 0,
            Category = "Workshop"
        },
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "AI/ML Hackathon 2024",
            Description = "24-hour hackathon focused on building AI/ML solutions for real-world problems. Teams of 3-4 members.",
            EventDate = DateTime.UtcNow.AddDays(14),
            TotalSeats = 100,
            OccupiedSeats = 0,
            Category = "Hackathon"
        },
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "Cloud Computing Fundamentals",
            Description = "An introduction to cloud computing concepts, AWS services, and deploying applications to the cloud.",
            EventDate = DateTime.UtcNow.AddDays(5),
            TotalSeats = 40,
            OccupiedSeats = 0,
            Category = "Seminar"
        },
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "Cybersecurity Workshop",
            Description = "Hands-on workshop covering ethical hacking, penetration testing, and security best practices.",
            EventDate = DateTime.UtcNow.AddDays(10),
            TotalSeats = 30,
            OccupiedSeats = 0,
            Category = "Workshop"
        },
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "Open Source Contribution Sprint",
            Description = "Contribute to open source projects with mentorship from industry professionals. Beginner friendly.",
            EventDate = DateTime.UtcNow.AddDays(21),
            TotalSeats = 60,
            OccupiedSeats = 0,
            Category = "Hackathon"
        },
        new TechFest.Core.Entities.Event
        {
            Id = Guid.NewGuid(),
            Title = "Data Science with Python",
            Description = "Deep dive into data analysis, visualization, and machine learning using Python, Pandas, and Scikit-learn.",
            EventDate = DateTime.UtcNow.AddDays(3),
            TotalSeats = 45,
            OccupiedSeats = 0,
            Category = "Workshop"
        }
    };

    db.Events.AddRange(events);
    await db.SaveChangesAsync();
}
