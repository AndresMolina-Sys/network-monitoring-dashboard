var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .GetChildren()
    .Select(section => section.Value ?? string.Empty)
    .Where(origin => !string.IsNullOrWhiteSpace(origin))
    .ToArray();

if (allowedOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "At least one CORS origin must be configured."
    );
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddOpenApi();

builder.Services.AddHealthChecks();

var app = builder.Build();

app.UseCors("Frontend");

app.MapHealthChecks("/health")
    .WithName("HealthCheck");

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

var metricsAnchorTimestamp = DateTimeOffset.Parse("2026-09-13T18:00:00Z");

static NodeMetrics CreateHistoricalMetrics(
    string nodeId,
    string range,
    DateTimeOffset anchorTimestamp,
    int sampleCount,
    int cadenceMinutes,
    double latencyMs,
    double latencyVariationMs,
    double packetLossPercent,
    double packetLossStepPercent
)
{
    var points = Enumerable
        .Range(0, sampleCount)
        .Select(index => new MetricPoint(
            anchorTimestamp.AddMinutes(-cadenceMinutes * (sampleCount - index - 1)),
            Math.Max(0, latencyMs + ((index % 9) - 4) * latencyVariationMs),
            Math.Round(packetLossPercent + (index % 5) * packetLossStepPercent, 1)
        ))
        .ToArray();

    return new NodeMetrics(nodeId, range, points);
}

static Dictionary<string, NodeMetrics> CreateMetricsByRange(
    string nodeId,
    NodeMetrics oneHourMetrics,
    DateTimeOffset anchorTimestamp,
    double latencyMs,
    double latencyVariationMs,
    double packetLossPercent,
    double packetLossStepPercent
)
{
    return new Dictionary<string, NodeMetrics>(StringComparer.OrdinalIgnoreCase)
    {
        ["1h"] = oneHourMetrics,
        ["24h"] = CreateHistoricalMetrics(
            nodeId,
            "24h",
            anchorTimestamp,
            25,
            60,
            latencyMs,
            latencyVariationMs,
            packetLossPercent,
            packetLossStepPercent
        ),
        ["7d"] = CreateHistoricalMetrics(
            nodeId,
            "7d",
            anchorTimestamp,
            29,
            360,
            latencyMs,
            latencyVariationMs,
            packetLossPercent,
            packetLossStepPercent
        ),
    };
}

var metricsByNode = new Dictionary<string, Dictionary<string, NodeMetrics>>(
    StringComparer.Ordinal
)
{
    ["core-router"] = CreateMetricsByRange(
        "core-router",
        new NodeMetrics(
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
        metricsAnchorTimestamp,
        19,
        1,
        0,
        0.1
    ),
    ["access-switch-01"] = CreateMetricsByRange(
        "access-switch-01",
        new NodeMetrics(
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
        metricsAnchorTimestamp,
        38,
        2,
        0.5,
        0.2
    ),
    ["branch-gateway"] = CreateMetricsByRange(
        "branch-gateway",
        new NodeMetrics(
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
        metricsAnchorTimestamp,
        145,
        5,
        3,
        0.4
    ),
};

app.MapGet("/api/nodes", () => nodes)
    .WithName("ListNetworkNodes");

app.MapGet("/api/nodes/{nodeId}", (string nodeId) =>
{
    var node = nodes.FirstOrDefault(candidate =>
        string.Equals(candidate.Id, nodeId, StringComparison.Ordinal)
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
        if (!metricsByNode.TryGetValue(nodeId, out var metricsByRange))
        {
            return Results.NotFound();
        }

        var requestedRange = string.IsNullOrWhiteSpace(range)
            ? "1h"
            : range;

        if (!metricsByRange.TryGetValue(requestedRange, out var metrics))
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

public partial class Program
{
}

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
