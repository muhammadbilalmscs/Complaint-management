using CivicConnect.Api.Data;
using CivicConnect.Api.Services;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useSqlite = string.IsNullOrWhiteSpace(connectionString);
string? sqlitePath = null;

if (useSqlite)
{
    var dataDirectory = ResolveDataDirectory();
    Directory.CreateDirectory(dataDirectory);
    sqlitePath = Path.Combine(dataDirectory, "civicconnect.db");
}

builder.Services.AddDbContext<CivicConnectDbContext>(options =>
{
    if (useSqlite)
    {
        options.UseSqlite($"Data Source={sqlitePath}");
    }
    else
    {
        options.UseNpgsql(connectionString);
    }
});
builder.Services.AddScoped<ComplaintService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (useSqlite)
{
    app.Logger.LogWarning("No PostgreSQL connection string is configured. Complaints are stored in {DatabasePath}.", sqlitePath);
}

await using (var scope = app.Services.CreateAsyncScope())
{
    var db = scope.ServiceProvider.GetRequiredService<CivicConnectDbContext>();
    if (useSqlite)
    {
        await db.Database.EnsureCreatedAsync();
    }
    else
    {
        await db.Database.MigrateAsync();
    }

    await ComplaintSeed.SeedAsync(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "CivicConnect API");
        options.RoutePrefix = "swagger";
    });
}

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();
app.MapFallbackToFile("index.html");

app.Run();

static string ResolveDataDirectory()
{
    var configured = Environment.GetEnvironmentVariable("CIVICCONNECT_DATA");
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured;
    }

    var home = Environment.GetEnvironmentVariable("HOME");
    if (!string.IsNullOrWhiteSpace(home))
    {
        return Path.Combine(home, "data");
    }

    return Path.Combine(AppContext.BaseDirectory, "data");
}
