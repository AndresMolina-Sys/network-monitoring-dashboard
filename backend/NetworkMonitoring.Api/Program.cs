var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("LocalFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:4173",
                "http://127.0.0.1:4173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("LocalFrontend");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var nodes = new[]
{
    new NetworkNode(
        "core-router",
        "Core Router",
        "online",
        "10.0.0.1",
        "Main office",
        DateTimeOffset.Parse("2026-09-13T18:00:00Z")
    ),
    new NetworkNode(
        "access-switch-01",
        "Access Switch 01",
        "degraded",
        "10.0.0.10",
        "Main office",
        DateTimeOffset.Parse("2026-09-13T17:58:00Z")
    ),
    new NetworkNode(
        "branch-gateway",
        "Branch Gateway",
        "offline",
        "10.10.0.1",
        "Branch office",
        DateTimeOffset.Parse("2026-09-13T17:45:00Z")
    ),
};

var metricsByNode = new Dictionary<string, NodeMetrics>(
    StringComparer.OrdinalIgnoreCase
)
{
    ["core-router"] = new NodeMetrics(
        "core-router",
        "1h",
        new[]
        {
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:00:00Z"), 18, 0),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:20:00Z"), 20, 0),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:40:00Z"), 17, 0.2),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T18:00:00Z"), 19, 0),
        }
    ),
    ["access-switch-01"] = new NodeMetrics(
        "access-switch-01",
        "1h",
        new[]
        {
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:00:00Z"), 34, 0),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:20:00Z"), 35, 0.5),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:40:00Z"), 40, 1.2),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T18:00:00Z"), 38, 0.6),
        }
    ),
    ["branch-gateway"] = new NodeMetrics(
        "branch-gateway",
        "1h",
        new[]
        {
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:00:00Z"), 125, 2.5),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:20:00Z"), 140, 3),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T17:40:00Z"), 152, 4.2),
            new MetricPoint(DateTimeOffset.Parse("2026-09-13T18:00:00Z"), 148, 3.1),
        }
    ),
};

app.MapGet("/api/nodes", () => nodes)
    .WithName("ListNetworkNodes");

app.MapGet("/api/nodes/{nodeId}", (string nodeId) =>
{
    var node = nodes.FirstOrDefault(candidate =>
        string.Equals(candidate.Id, nodeId, StringComparison.OrdinalIgnoreCase)
    );

    return node is null
        ? Results.NotFound()
        : Results.Ok(node);
})
.WithName("GetNetworkNode");

app.MapGet(
    "/api/nodes/{nodeId}/metrics",
    (string nodeId, string? range) =>
    {
        if (!metricsByNode.TryGetValue(nodeId, out var metrics))
        {
            return Results.NotFound();
        }

        var requestedRange = string.IsNullOrWhiteSpace(range)
            ? "1h"
            : range;

        if (!string.Equals(
                metrics.Range,
                requestedRange,
                StringComparison.OrdinalIgnoreCase
            ))
        {
            return Results.BadRequest(new
            {
                message = $"Metrics range \"{requestedRange}\" is not available yet.",
            });
        }

        return Results.Ok(metrics);
    }
)
.WithName("GetNodeMetrics");

app.Run();

public record NetworkNode(
    string Id,
    string Name,
    string Status,
    string Address,
    string Location,
    DateTimeOffset LastCheckedAt
);

public record NodeMetrics(
    string NodeId,
    string Range,
    IReadOnlyList<MetricPoint> Points
);

public record MetricPoint(
    DateTimeOffset Timestamp,
    double LatencyMs,
    double PacketLossPercent
);