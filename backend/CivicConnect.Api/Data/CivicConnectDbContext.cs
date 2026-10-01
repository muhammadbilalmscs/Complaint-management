using CivicConnect.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CivicConnect.Api.Data;

public class CivicConnectDbContext : DbContext
{
    public CivicConnectDbContext(DbContextOptions<CivicConnectDbContext> options)
        : base(options)
    {
    }

    public DbSet<Complaint> Complaints => Set<Complaint>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var complaint = modelBuilder.Entity<Complaint>();

        complaint.Property(item => item.Title).HasMaxLength(120).IsRequired();
        complaint.Property(item => item.Description).HasMaxLength(2000).IsRequired();
        complaint.Property(item => item.Category).HasMaxLength(50).IsRequired();
        complaint.Property(item => item.Priority).HasMaxLength(20).IsRequired();
        complaint.Property(item => item.Status).HasMaxLength(20).IsRequired();
        complaint.Property(item => item.CreatedBy).HasMaxLength(120).IsRequired();
        complaint.Property(item => item.CreatedAt).IsRequired();
    }
}
