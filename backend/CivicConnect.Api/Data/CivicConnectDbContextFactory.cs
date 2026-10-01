using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace CivicConnect.Api.Data;

public class CivicConnectDbContextFactory : IDesignTimeDbContextFactory<CivicConnectDbContext>
{
    public CivicConnectDbContext CreateDbContext(string[] args)
    {
        var projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", ".."));
        var configuration = new ConfigurationBuilder()
            .SetBasePath(projectDirectory)
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddEnvironmentVariables()
            .Build();

        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException(
                "Connection string 'DefaultConnection' is not configured. Set ConnectionStrings__DefaultConnection or appsettings.Development.json.");
        }

        var options = new DbContextOptionsBuilder<CivicConnectDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new CivicConnectDbContext(options);
    }
}
