using System.ComponentModel.DataAnnotations;
using CivicConnect.Api.Models;

namespace CivicConnect.Api.DTOs;

public class UpdateComplaintDto : IValidatableObject
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(120)]
    public string Title { get; set; } = string.Empty;

    [Required(ErrorMessage = "Description is required.")]
    [MaxLength(2000)]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [Required(ErrorMessage = "Priority is required.")]
    [MaxLength(20)]
    public string Priority { get; set; } = string.Empty;

    [Required(ErrorMessage = "Status is required.")]
    [MaxLength(20)]
    public string Status { get; set; } = string.Empty;

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (!string.IsNullOrWhiteSpace(Category) && !ComplaintValues.Categories.Contains(Category))
        {
            yield return new ValidationResult("Category is not recognized.", [nameof(Category)]);
        }

        if (!string.IsNullOrWhiteSpace(Priority) && !ComplaintValues.Priorities.Contains(Priority))
        {
            yield return new ValidationResult("Priority is not recognized.", [nameof(Priority)]);
        }

        if (!string.IsNullOrWhiteSpace(Status) && !ComplaintValues.Statuses.Contains(Status))
        {
            yield return new ValidationResult("Status is not recognized.", [nameof(Status)]);
        }
    }
}
