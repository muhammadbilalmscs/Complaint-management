namespace CivicConnect.Api.Models;

public static class ComplaintValues
{
    public const string DefaultStatus = "Open";

    public const string DefaultCreatedBy = "Demo User";

    public static readonly string[] Categories =
    [
        "Transport",
        "Utilities",
        "Environment",
        "Public Services",
        "Infrastructure",
        "Other",
    ];

    public static readonly string[] Priorities = ["Low", "Medium", "High"];

    public static readonly string[] Statuses = ["Open", "In Progress", "Resolved", "Closed"];
}
