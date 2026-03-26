using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VirtualExcursion.DAL.models;

namespace VirtualExcursion.DAL.context
{
    public class VExContext : DbContext
    {
        public VExContext()
        {
        }
        public VExContext(DbContextOptions<VExContext> options)
        : base(options)
        {
        }
       

        public DbSet<User> Users { get; set; }
        public DbSet<GuideProfile> GuideProfiles { get; set; }
        public DbSet<Scene> Scenes { get; set; }
        public DbSet<ModelScene> ModelScenes { get; set; }
        //public DbSet<PhotoScene> PhotoScenes { get; set; }
        //public DbSet<VideoScene> VideoScenes { get; set; }
        public DbSet<POI> PointsOfInterest { get; set; }
        public DbSet<Tag> Tags { get; set; }
        public DbSet<SceneTag> SceneTags { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // ==================== User & GuideProfile ====================

            // User → GuideProfile (один-к-одному)
            modelBuilder.Entity<User>()
                .HasOne(u => u.GuideProfile)
                .WithOne(g => g.User)
                .HasForeignKey<GuideProfile>(g => g.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // Индекс для email (уникальность)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // ==================== GuideProfile & Scene ====================

            // GuideProfile → Scene (один-ко-многим)
            modelBuilder.Entity<GuideProfile>()
                .HasMany(g => g.Scenes)
                .WithOne(s => s.Author)
                .HasForeignKey(s => s.AuthorId)
                .OnDelete(DeleteBehavior.Restrict); // Не удаляем сцены при удалении профиля

            // ==================== Scene & ModelScene ====================

            // Scene → ModelScene (один-к-одному)
            modelBuilder.Entity<Scene>()
                .HasOne(s => s.ModelScene)
                .WithOne(t => t.Scene)
                .HasForeignKey<ModelScene>(t => t.SceneId)
                .OnDelete(DeleteBehavior.Cascade);

            //// ==================== Scene & PhotoScene ====================

            //modelBuilder.Entity<Scene>()
            //    .HasOne(s => s.PhotoScene)
            //    .WithOne(p => p.Scene)
            //    .HasForeignKey<PhotoScene>(p => p.SceneId)
            //    .OnDelete(DeleteBehavior.Cascade);

            //// ==================== Scene & VideoScene ====================

            //modelBuilder.Entity<Scene>()
            //    .HasOne(s => s.VideoScene)
            //    .WithOne(v => v.Scene)
            //    .HasForeignKey<VideoScene>(v => v.SceneId)
            //    .OnDelete(DeleteBehavior.Cascade);

            // ==================== Scene & POI ====================

            // Scene → POI (один-ко-многим)
            modelBuilder.Entity<Scene>()
                .HasMany(s => s.PointsOfInterest)
                .WithOne(p => p.Scene)
                .HasForeignKey(p => p.SceneId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== Scene & Tags (многие-ко-многим) ====================

            // Составной первичный ключ для SceneTag
            modelBuilder.Entity<SceneTag>()
                .HasKey(st => new { st.SceneId, st.TagId });

            // Scene → SceneTag
            modelBuilder.Entity<SceneTag>()
                .HasOne(st => st.Scene)
                .WithMany(s => s.SceneTags)
                .HasForeignKey(st => st.SceneId)
                .OnDelete(DeleteBehavior.Cascade);

            // Tag → SceneTag
            modelBuilder.Entity<SceneTag>()
                .HasOne(st => st.Tag)
                .WithMany(t => t.SceneTags)
                .HasForeignKey(st => st.TagId)
                .OnDelete(DeleteBehavior.Cascade);

            // ==================== Индексы для оптимизации ====================

            // Scene: индексы для фильтрации и сортировки
            modelBuilder.Entity<Scene>()
                .HasIndex(s => s.AuthorId);

            modelBuilder.Entity<Scene>()
                .HasIndex(s => s.ContentType);

            modelBuilder.Entity<Scene>()
                .HasIndex(s => s.CreatedAt);

            modelBuilder.Entity<Scene>()
                .HasIndex(s => new { s.IsPublished, s.CreatedAt });

            // Tag: уникальный индекс на Slug
            modelBuilder.Entity<Tag>()
                .HasIndex(t => t.Slug)
                .IsUnique();

            // Tag: уникальный индекс на Name
            modelBuilder.Entity<Tag>()
                .HasIndex(t => t.Name)
                .IsUnique();

            // POI: индексы для быстрого поиска по сцене
            modelBuilder.Entity<POI>()
                .HasIndex(p => p.SceneId);

            // ==================== Настройка типов данных ====================

            // Ограничения длины строк
            modelBuilder.Entity<User>()
                .Property(u => u.Email)
                .HasMaxLength(256);

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .HasMaxLength(100);

            modelBuilder.Entity<GuideProfile>()
                .Property(g => g.OrganizationName)
                .HasMaxLength(200);

            modelBuilder.Entity<Scene>()
                .Property(s => s.Title)
                .HasMaxLength(200);

            modelBuilder.Entity<Scene>()
                .Property(s => s.ContentType)
                .HasMaxLength(20);

            modelBuilder.Entity<Tag>()
                .Property(t => t.Name)
                .HasMaxLength(100);

            modelBuilder.Entity<Tag>()
                .Property(t => t.Slug)
                .HasMaxLength(100);

            modelBuilder.Entity<POI>()
                .Property(p => p.Name)
                .HasMaxLength(200);

            modelBuilder.Entity<POI>()
                .Property(p => p.IconType)
                .HasMaxLength(50);

            // Точность для координат (float в PostgreSQL это real)
            // ModelScene — координаты и интенсивность
            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraStartX)
                .HasColumnType("float"); // или "real" если нужна меньшая точность

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraStartY)
                .HasColumnType("float");

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraStartZ)
                .HasColumnType("float");

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraTargetX)
                .HasColumnType("float");

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraTargetY)
                .HasColumnType("float");

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.CameraTargetZ)
                .HasColumnType("float");

            modelBuilder.Entity<ModelScene>()
                .Property(t => t.AmbientLightIntensity)
                .HasColumnType("float");

            // POI — координаты
            modelBuilder.Entity<POI>()
                .Property(p => p.CoordinateX)
                .HasColumnType("float");

            modelBuilder.Entity<POI>()
                .Property(p => p.CoordinateY)
                .HasColumnType("float");

            modelBuilder.Entity<POI>()
                .Property(p => p.CoordinateZ)
                .HasColumnType("float");
        }
    }
}
