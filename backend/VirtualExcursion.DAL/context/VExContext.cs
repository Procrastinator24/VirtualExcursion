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
        public DbSet<Excursion> Excursion { get; set; }
        public DbSet<ExcursionScene> ExcursionScene { get; set; }
        public DbSet<Favourite> Favourite { get; set; }
        public DbSet<ExcursionTag> ExcursionTag { get; set; }
        public DbSet<Workspace> Workspaces { get; set; }
        public DbSet<WorkspaceMember> WorkspacesMembers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Workspace
            modelBuilder.Entity<Workspace>(entity =>
            {
                entity.HasKey(w => w.Id);

                

                entity.Property(w => w.Name).IsRequired().HasMaxLength(200);
                //entity.Property(w => w.Type).HasMaxLength(50).HasDefaultValue("personal");

                entity.HasOne(w => w.Owner)
                    .WithMany()
                    .HasForeignKey(w => w.OwnerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(w => w.VerificationStatus)
                .HasConversion<string>()
                .HasMaxLength(20)
                .HasDefaultValue(VerificationStatus.NotSubmitted);

                entity.HasIndex(w => w.OwnerId);
                entity.HasIndex(w => w.VerificationStatus);
                //entity.HasIndex(w => w.Type);
            });

            modelBuilder.Entity<WorkspaceMember>(entity =>
            {
                entity.HasKey(wm => new { wm.WorkspaceId, wm.UserId });

                entity.HasOne(wm => wm.Workspace)
                    .WithMany(w => w.Members)
                    .HasForeignKey(wm => wm.WorkspaceId);

                entity.HasOne(wm => wm.User)
                    .WithMany()
                    .HasForeignKey(wm => wm.UserId);

                entity.HasOne(wm => wm.InvitedBy)
                    .WithMany()
                    .HasForeignKey(wm => wm.InvitedById)
                    .OnDelete(DeleteBehavior.Restrict);

                
                entity.Property(wm => wm.Role)
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(WorkspaceRole.Editor);

                entity.Property(wm => wm.InvitationStatus)
                    .HasConversion<string>()
                    .HasMaxLength(20)
                    .HasDefaultValue(InvitationStatus.Accepted);

                entity.Property(wm => wm.JoinedAt)
                    .HasDefaultValueSql("GETUTCDATE()");
            });

            // Excursion — добавить связь с Workspace
            modelBuilder.Entity<Excursion>(entity =>
            {
                entity.HasOne(e => e.Workspace)
                    .WithMany(w => w.Excursions)
                    .HasForeignKey(e => e.WorkspaceId)
                    .OnDelete(DeleteBehavior.SetNull);  // при удалении Workspace — экскурсии остаются, но без автора
            });

            // Scene — добавить связь с Workspace
            modelBuilder.Entity<Scene>(entity =>
            {
                entity.HasOne(s => s.Workspace)
                    .WithMany(w => w.Scenes)
                    .HasForeignKey(s => s.WorkspaceId)
                    .OnDelete(DeleteBehavior.SetNull);
            });


            // ==================== User & GuideProfile ====================

            // User → GuideProfile (один-к-одному)
            //modelBuilder.Entity<User>()
            //    .HasOne(u => u.GuideProfile)
            //    .WithOne(g => g.User)
            //    .HasForeignKey<GuideProfile>(g => g.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);

            // Индекс для email (уникальность)
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<Scene>()
                .Property(s => s.ContentType)
                .HasDefaultValue("3d");


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


            // ExcursionScene (многие-ко-многим с порядком)
            modelBuilder.Entity<ExcursionScene>()
                .HasKey(es => new { es.ExcursionId, es.SceneId });

            modelBuilder.Entity<ExcursionScene>()
                .HasOne(es => es.Excursion)
                .WithMany(e => e.ExcursionScenes)
                .HasForeignKey(es => es.ExcursionId);

            modelBuilder.Entity<ExcursionScene>()
                .HasOne(es => es.Scene)
                .WithMany(s => s.ExcursionScenes)
                .HasForeignKey(es => es.SceneId);

            // Favourite
            modelBuilder.Entity<Favourite>()
                .HasOne(f => f.User)
                .WithMany(u => u.Favourites)
                .HasForeignKey(f => f.UserId);


            // ExcursionTag
            modelBuilder.Entity<ExcursionTag>()
                .HasKey(et => new { et.ExcursionId, et.TagId });

            modelBuilder.Entity<ExcursionTag>()
                .HasOne(et => et.Excursion)
                .WithMany(e => e.ExcursionTags)
                .HasForeignKey(et => et.ExcursionId);

            modelBuilder.Entity<ExcursionTag>()
                .HasOne(et => et.Tag)
                .WithMany(t => t.ExcursionTags)
                .HasForeignKey(et => et.TagId);

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
