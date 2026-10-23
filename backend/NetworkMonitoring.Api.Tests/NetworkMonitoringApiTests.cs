using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace NetworkMonitoring.Api.Tests;

public sealed class NetworkMonitoringApiTests
    : IClassFixture<WebApplicationFactory<global::Program>>
{
    private static readonly string[] NodeIds =
    [
        "core-router",
        "access-switch-01",
        "branch-gateway",
    ];

    private static readonly (string Range, int SampleCount, TimeSpan Cadence)[] MetricRanges =
    [
        ("1h", 4, TimeSpan.FromMinutes(20)),
        ("24h", 25, TimeSpan.FromHours(1)),
        ("7d", 29, TimeSpan.FromHours(6)),
    ];

    private readonly HttpClient client;

    public NetworkMonitoringApiTests(
        WebApplicationFactory<global::Program> factory
    )
    {
        client = factory.CreateClient();
    }

    [Fact]
    public async Task Health_returns_healthy()
    {
        var response = await client.GetAsync("/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task List_nodes_returns_all_monitored_nodes()
    {
        var nodes = await client.GetFromJsonAsync<NetworkNodeResponse[]>(
            "/api/nodes"
        );

        Assert.NotNull(nodes);
        Assert.Equal(3, nodes!.Length);
        Assert.Equal("core-router", nodes[0].Id);
    }

    [Fact]
    public async Task Get_node_returns_the_requested_node()
    {
        var node = await client.GetFromJsonAsync<NetworkNodeResponse>(
            "/api/nodes/core-router"
        );

        Assert.NotNull(node);
        Assert.Equal("core-router", node!.Id);
        Assert.Equal("Core Router", node.Name);
    }

    [Fact]
    public async Task Get_unknown_node_returns_not_found()
    {
        var response = await client.GetAsync("/api/nodes/unknown-node");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Get_node_and_metrics_reject_mixed_case_node_ids()
    {
        var nodeResponse = await client.GetAsync("/api/nodes/CORE-ROUTER");
        var metricsResponse = await client.GetAsync("/api/nodes/CORE-ROUTER/metrics?range=1h");

        Assert.Equal(HttpStatusCode.NotFound, nodeResponse.StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, metricsResponse.StatusCode);
    }

    [Fact]
    public async Task Get_metrics_returns_complete_ranges_for_all_nodes()
    {
        foreach (var nodeId in NodeIds)
        {
            DateTimeOffset? sharedLatestTimestamp = null;

            foreach (var (range, sampleCount, cadence) in MetricRanges)
            {
                var metrics = await client.GetFromJsonAsync<NodeMetricsResponse>(
                    $"/api/nodes/{nodeId}/metrics?range={range}"
                );

                Assert.NotNull(metrics);
                Assert.Equal(nodeId, metrics!.NodeId);
                Assert.Equal(range, metrics.Range);
                Assert.Equal(sampleCount, metrics.Points.Count);
                Assert.All(
                    metrics.Points,
                    point => Assert.Equal(TimeSpan.Zero, point.Timestamp.Offset)
                );

                for (var index = 1; index < metrics.Points.Count; index++)
                {
                    Assert.Equal(
                        cadence,
                        metrics.Points[index].Timestamp - metrics.Points[index - 1].Timestamp
                    );
                }

                var latestTimestamp = metrics.Points[metrics.Points.Count - 1].Timestamp;
                if (sharedLatestTimestamp is null)
                {
                    sharedLatestTimestamp = latestTimestamp;
                }
                else
                {
                    Assert.Equal(sharedLatestTimestamp.Value, latestTimestamp);
                }
            }
        }
    }

    [Fact]
    public async Task Get_metrics_without_range_defaults_to_one_hour()
    {
        var metrics = await client.GetFromJsonAsync<NodeMetricsResponse>(
            "/api/nodes/core-router/metrics"
        );

        Assert.NotNull(metrics);
        Assert.Equal("core-router", metrics!.NodeId);
        Assert.Equal("1h", metrics.Range);
        Assert.Equal(4, metrics.Points.Count);
    }

    [Fact]
    public async Task Get_metrics_with_unsupported_range_returns_bad_request()
    {
        var response = await client.GetAsync(
            "/api/nodes/core-router/metrics?range=12h"
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Get_metrics_for_unknown_node_returns_not_found()
    {
        var response = await client.GetAsync(
            "/api/nodes/unknown-node/metrics?range=12h"
        );

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Allowed_frontend_origin_receives_cors_header()
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            "/api/nodes"
        );

        request.Headers.TryAddWithoutValidation(
            "Origin",
            "http://localhost:5173"
        );

        var response = await client.SendAsync(request);

        Assert.Equal(
            "http://localhost:5173",
            response.Headers.GetValues("Access-Control-Allow-Origin").Single()
        );
    }

    [Fact]
    public async Task Vercel_frontend_origin_receives_cors_header()
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            "/api/nodes"
        );

        request.Headers.TryAddWithoutValidation(
            "Origin",
            "https://network-monitoring-dashboard-zeta.vercel.app"
        );

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(
            "https://network-monitoring-dashboard-zeta.vercel.app",
            response.Headers.GetValues("Access-Control-Allow-Origin").Single()
        );
    }

    [Fact]
    public async Task Unauthorized_origin_does_not_receive_cors_header()
    {
        using var request = new HttpRequestMessage(
            HttpMethod.Get,
            "/api/nodes"
        );

        request.Headers.TryAddWithoutValidation(
            "Origin",
            "https://unauthorized.example"
        );

        var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.False(
            response.Headers.Contains("Access-Control-Allow-Origin")
        );
    }

    private sealed record NetworkNodeResponse(
        string Id,
        string Name,
        string Status,
        string Address,
        string Location,
        DateTimeOffset LastCheckedAt
    );

    private sealed record NodeMetricsResponse(
        string NodeId,
        string Range,
        IReadOnlyList<MetricPointResponse> Points
    );

    private sealed record MetricPointResponse(
        DateTimeOffset Timestamp,
        double LatencyMs,
        double PacketLossPercent
    );
}
