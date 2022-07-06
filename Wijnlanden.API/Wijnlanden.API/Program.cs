using Serilog;
using Wijnlanden.API.Services;

var builder = WebApplication.CreateBuilder(args);

var logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Logging.ClearProviders();
builder.Logging.AddSerilog(logger);

// Add services to the container.
builder.Services.AddCors(options => {
    options.AddPolicy(name: "pol", pol => {
        pol.AllowAnyMethod().AllowAnyOrigin().AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<EmailPollingService>();
builder.Services.AddScoped<ImportService>();
builder.Services.AddScoped<FoodService>();
builder.Services.AddScoped<GuestService>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment()) {

}

app.UseSwagger();
app.UseSwaggerUI();
var pollingService = app.Services.GetRequiredService<EmailPollingService>();
pollingService.PollEmailMessages();

app.UseHttpsRedirection();
app.UseCors("pol");
app.UseAuthorization();

app.Use(async (context, next) => {
    //TODO: This is an absolute hack, but was so much faster to implement, [Authorization] pattern should be used here
    var secret = context.Request.Headers["secret"];
    if (string.IsNullOrWhiteSpace(secret) || !secret.Equals("super-unsafe-authentication-but-yolo")) {
        throw new UnauthorizedAccessException("No no, why are you like this?");
    }

    // Call the next delegate/middleware in the pipeline.
    await next(context);
});

app.MapControllers();

app.Run();
