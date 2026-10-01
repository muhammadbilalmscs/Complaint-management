using CivicConnect.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CivicConnect.Api.Data;

public static class ComplaintSeed
{
    public static async Task SeedAsync(CivicConnectDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Complaints.AnyAsync(cancellationToken))
        {
            return;
        }

        db.Complaints.AddRange(
            Sample("Road surface damage on High Street", "A pothole near the bus stop is damaging vehicles.", "Transport", "Medium", "Open", new DateTime(2026, 9, 20, 12, 0, 0, DateTimeKind.Utc), "Amina Shah"),
            Sample("Water leak on Oak Avenue", "Water is pooling on the pavement outside number 14.", "Utilities", "High", "Open", new DateTime(2026, 9, 18, 12, 0, 0, DateTimeKind.Utc), "Jonas Berg"),
            Sample("Night noise from the market", "Loading vehicles arrive after midnight on weekdays.", "Other", "Low", "Closed", new DateTime(2026, 8, 28, 12, 0, 0, DateTimeKind.Utc), "Elena Rossi"),
            Sample("Litter in Riverside Park", "Bins near the playground are overflowing.", "Environment", "Medium", "In Progress", new DateTime(2026, 9, 12, 12, 0, 0, DateTimeKind.Utc), "Amina Shah"),
            Sample("Library opening hours", "Saturday hours are too short for students.", "Public Services", "Low", "Resolved", new DateTime(2026, 9, 8, 12, 0, 0, DateTimeKind.Utc), "Noah Williams"),
            Sample("Bridge inspection request", "The footbridge railing is loose at the north end.", "Infrastructure", "High", "Open", new DateTime(2026, 9, 22, 12, 0, 0, DateTimeKind.Utc), "Jonas Berg"),
            Sample("Street lighting on Mill Lane", "Three lamps have been out for a week.", "Utilities", "Medium", "In Progress", new DateTime(2026, 9, 15, 12, 0, 0, DateTimeKind.Utc), "Elena Rossi"),
            Sample("Bus stop shelter missing panel", "The glass panel on the eastbound shelter is gone.", "Transport", "Low", "Resolved", new DateTime(2026, 9, 4, 12, 0, 0, DateTimeKind.Utc), "Noah Williams"));

        await db.SaveChangesAsync(cancellationToken);
    }

    private static Complaint Sample(
        string title,
        string description,
        string category,
        string priority,
        string status,
        DateTime createdAt,
        string createdBy)
    {
        return new Complaint
        {
            Title = title,
            Description = description,
            Category = category,
            Priority = priority,
            Status = status,
            CreatedAt = createdAt,
            CreatedBy = createdBy,
        };
    }
}
