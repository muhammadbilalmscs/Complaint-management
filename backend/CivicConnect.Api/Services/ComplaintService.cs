using CivicConnect.Api.Data;
using CivicConnect.Api.DTOs;
using CivicConnect.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace CivicConnect.Api.Services;

public class ComplaintService
{
    private readonly CivicConnectDbContext _db;

    public ComplaintService(CivicConnectDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ComplaintDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var complaints = await _db.Complaints
            .AsNoTracking()
            .OrderByDescending(complaint => complaint.CreatedAt)
            .ThenByDescending(complaint => complaint.Id)
            .ToListAsync(cancellationToken);

        return complaints.Select(ToDto).ToList();
    }

    public async Task<ComplaintDto?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var complaint = await _db.Complaints
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == id, cancellationToken);

        return complaint is null ? null : ToDto(complaint);
    }

    public async Task<ComplaintDto> CreateAsync(CreateComplaintDto request, CancellationToken cancellationToken)
    {
        var complaint = new Complaint
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            Category = request.Category.Trim(),
            Priority = request.Priority.Trim(),
            Status = ComplaintValues.DefaultStatus,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = ComplaintValues.DefaultCreatedBy,
        };

        _db.Complaints.Add(complaint);
        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(complaint);
    }

    public async Task<ComplaintDto?> UpdateAsync(int id, UpdateComplaintDto request, CancellationToken cancellationToken)
    {
        var complaint = await _db.Complaints.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (complaint is null)
        {
            return null;
        }

        complaint.Title = request.Title.Trim();
        complaint.Description = request.Description.Trim();
        complaint.Category = request.Category.Trim();
        complaint.Priority = request.Priority.Trim();
        complaint.Status = request.Status.Trim();

        await _db.SaveChangesAsync(cancellationToken);
        return ToDto(complaint);
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var complaint = await _db.Complaints.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (complaint is null)
        {
            return false;
        }

        _db.Complaints.Remove(complaint);
        await _db.SaveChangesAsync(cancellationToken);
        return true;
    }

    private static ComplaintDto ToDto(Complaint complaint)
    {
        return new ComplaintDto
        {
            Id = complaint.Id,
            Title = complaint.Title,
            Description = complaint.Description,
            Category = complaint.Category,
            Priority = complaint.Priority,
            Status = complaint.Status,
            CreatedAt = complaint.CreatedAt,
            CreatedBy = complaint.CreatedBy,
        };
    }
}
