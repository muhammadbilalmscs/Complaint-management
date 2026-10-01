using CivicConnect.Api.DTOs;
using CivicConnect.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace CivicConnect.Api.Controllers;

[ApiController]
[Route("api/complaints")]
public class ComplaintsController : ControllerBase
{
    private readonly ComplaintService _complaints;

    public ComplaintsController(ComplaintService complaints)
    {
        _complaints = complaints;
    }

    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ComplaintDto>>> GetAll(CancellationToken cancellationToken)
    {
        var complaints = await _complaints.GetAllAsync(cancellationToken);
        return Ok(complaints);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ComplaintDto>> GetById(int id, CancellationToken cancellationToken)
    {
        var complaint = await _complaints.GetByIdAsync(id, cancellationToken);
        if (complaint is null)
        {
            return NotFound();
        }

        return Ok(complaint);
    }

    [HttpPost]
    public async Task<ActionResult<ComplaintDto>> Create(CreateComplaintDto request, CancellationToken cancellationToken)
    {
        var complaint = await _complaints.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = complaint.Id }, complaint);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ComplaintDto>> Update(int id, UpdateComplaintDto request, CancellationToken cancellationToken)
    {
        var complaint = await _complaints.UpdateAsync(id, request, cancellationToken);
        if (complaint is null)
        {
            return NotFound();
        }

        return Ok(complaint);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var deleted = await _complaints.DeleteAsync(id, cancellationToken);
        if (!deleted)
        {
            return NotFound();
        }

        return NoContent();
    }
}
