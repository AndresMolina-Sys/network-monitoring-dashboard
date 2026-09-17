using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace NetworkMonitoring.Api.Tests;

public sealed class NetworkMonitoringApiTests
    : IClassFixture<WebApplicationFactory<global::Program>>
{
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
    public async Task Get_metrics_returns_metrics_for_the_requested_range()
    {
        var metrics = await client.GetFromJsonAsync<NodeMetricsResponse>(
            "/api/nodes/core-router/metrics?range=1h"
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
            "/api/nodes/core-router/metrics?range=24h"
        );

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Get_metrics_for_unknown_node_returns_not_found()
    {
        var response = await client.GetAsync(
            "/api/nodes/unknown-node/metrics?range=1h"
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