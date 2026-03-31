
using Microsoft.EntityFrameworkCore;
using VirtualExcursion.BLL.services;
using VirtualExcursion.BLL.services.interfaces;
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

            // Сервисы
            builder.Services.AddScoped<IPOIService, POIService>();
            builder.Services.AddScoped<IModelSceneService, ModelSceneService>();
            builder.Services.AddScoped<ITagService, TagService>();
            builder.Services.AddScoped<IGuideProfileService, GuideProfileService>();
            builder.Services.AddScoped<IUserService, UserService>();


            builder.Services.AddAutoMapper(typeof(VirtualExcursion.BLL.MappingProfileMarker));
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
