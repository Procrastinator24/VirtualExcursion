
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.Text;
using VirtualExcursion.BLL.services;
using VirtualExcursion.BLL.services.interfaces;
using VirtualExcursion.BLL.Services;
using VirtualExcursion.DAL.context;
using VirtualExcursion.DAL.Repositories;
using VirtualExcursion.DAL.Repositories.interfaces;

namespace VirtualExcursion
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<VExContext>(options => options.UseSqlServer(connectionString));
            
            builder.Services.AddScoped<IModelSceneRepository, ModelSceneRepository>();
            builder.Services.AddScoped<IPOIRepository, POIRepository>();
            builder.Services.AddScoped<ITagRepository, TagRepository>();
            builder.Services.AddScoped<IGuideProfileRepository, GuideProfileRepository>();
            builder.Services.AddScoped<IUserRepository,  UserRepository>();
            builder.Services.AddScoped<ISceneRepository, SceneRepository>();
            builder.Services.AddScoped<IExcursionRepository, ExcursionRepository>();
            builder.Services.AddScoped<IFavouriteRepository, FavouriteRepository>();
            builder.Services.AddScoped<IWorkspaceRepository, WorkspaceRepository>();
            builder.Services.AddScoped<IWorkspaceMemberRepository, WorkspaceMemberRepository>();



            // Сервисы
            builder.Services.AddScoped<IPOIService, POIService>();
            builder.Services.AddScoped<IModelSceneService, ModelSceneService>();
            builder.Services.AddScoped<ITagService, TagService>();
            builder.Services.AddScoped<IGuideProfileService, GuideProfileService>();
            builder.Services.AddScoped<IUserService, UserService>();
            builder.Services.AddScoped<IPasswordHashingService, PasswordHashingService>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ISceneService, SceneService>();
            builder.Services.AddScoped<IExcursionService, ExcursionService>();
            builder.Services.AddScoped<IFavouriteService, FavouriteService>();
            builder.Services.AddScoped<IEmailService, SmtpEmailService>();
            builder.Services.AddScoped<IWorkspaceService, WorkspaceService>();
            builder.Services.AddScoped<IWorkspaceMemberService, WorkspaceMemberService>();

            builder.Services.AddSingleton<IVerificationCodeStorage, InMemoryCodeStorage>();



            builder.Services.AddAutoMapper(typeof(VirtualExcursion.BLL.MappingProfileMarker));
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Virtual Excursion API",
                    Version = "v1",
                    Description = "API для управления виртуальными экскурсиями"
                });
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                c.IncludeXmlComments(xmlPath);

                // НАСТРОЙКА JWT ДЛЯ SWAGGER
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Введите JWT токен в формате: eyJhbGciOiJIUzI1NiIs..."
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[] {}
                    }
                });
            });


            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
            };

            // Для передачи токена через заголовок
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
                    if (!string.IsNullOrEmpty(token))
                    {
                        context.Token = token;
                    }
                    return Task.CompletedTask;
                }
            };
        });

            builder.Services.AddAuthorization();

            var app = builder.Build();
            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".glb"] = "model/gltf-binary";
            provider.Mappings[".gltf"] = "model/gltf+json";

            app.UseStaticFiles(new StaticFileOptions
            {
                ContentTypeProvider = provider
            });
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseStaticFiles(); 
                app.UseDirectoryBrowser();

            }

            app.UseHttpsRedirection();


            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
