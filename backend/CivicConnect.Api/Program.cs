using CivicConnect.Api.Data;
using CivicConnect.Api.Services;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("WEBSITE_SITE_NAME")))
{
    var port = Environment.GetEnvironmentVariable("PORT")
        ?? Environment.GetEnvironmentVariable("WEBSITES_PORT")
        ?? "8080";
    builder.WebHost.UseUrls($"http://0.0.0.0:{port}");
}

var connectionString = ResolveConnectionString(builder.Configuration);
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
        try
        {
            await db.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException(
                "PostgreSQL is configured, but the database could not be opened. Use the Azure server host, database civicconnect, SSL, and a firewall rule that allows this App Service.",
                ex);
        }
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

static string? ResolveConnectionString(IConfiguration configuration)
{
    var configured = configuration.GetConnectionString("DefaultConnection");
    if (!string.IsNullOrWhiteSpace(configured))
    {
        return configured.Trim();
    }

    // Azure portal connection strings are exposed under these names, not ConnectionStrings__DefaultConnection.
    string[] azureKeys =
    [
        "POSTGRESQLCONNSTR_DefaultConnection",
        "CUSTOMCONNSTR_DefaultConnection",
        "POSTGRESQLCONNSTR_POSTGRES_CONNECTION_STRING",
        "CUSTOMCONNSTR_POSTGRES_CONNECTION_STRING",
        "POSTGRES_CONNECTION_STRING"
    ];

    foreach (var key in azureKeys)
    {
        var value = configuration[key];
        if (!string.IsNullOrWhiteSpace(value))
        {
            return value.Trim();
        }
    }

    return null;
}

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
