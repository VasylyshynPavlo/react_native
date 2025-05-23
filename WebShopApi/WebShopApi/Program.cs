using Microsoft.AspNetCore.Identity;
using System;
using Microsoft.EntityFrameworkCore;
using WebShopApi.Data;
using WebShopApi.Data.Entities.Identity;
using Microsoft.Extensions.FileProviders;
using WebShopApi.Abstract;
using WebShopApi.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<WebShopDbContext>(opt =>
    opt.UseNpgsql(builder.Configuration.GetConnectionString("WebShopApiConnection"))
);

// builder.WebHost.ConfigureKestrel(serverOptions =>
// {
//     serverOptions.ListenAnyIP(5086);  // Слухати на всіх інтерфейсах
// });

builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 5;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
}).AddEntityFrameworkStores<WebShopDbContext>().AddDefaultTokenProviders();

var singinKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(
        builder.Configuration["JwtSecretKey"]
            ?? throw new NullReferenceException("JwtSecretKey")
    )
);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            IssuerSigningKey = singinKey,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddControllers();

// OpenAPI configuration
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Description = "Jwt Auth header using the Bearer scheme",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer"
        }
    );
    options.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Web Shop v1"));

// Set path for images
string imagesDirPath = Path.Combine(Directory.GetCurrentDirectory(), builder.Configuration["ImagesDir"]);
Directory.CreateDirectory(imagesDirPath);

// Serve static files from the 'uploading' directory
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(imagesDirPath),
    RequestPath = "/uploading"  // Access static files at "/images/{filename}"
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Run database seeding and start the app
await app.SeedAsync();

app.Run();
