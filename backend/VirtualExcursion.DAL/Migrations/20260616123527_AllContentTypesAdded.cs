using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AllContentTypesAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Excursion_GuideProfiles_GuideProfileId",
                table: "Excursion");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_GuideProfiles_AuthorId",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "GuideProfiles");

            migrationBuilder.DropIndex(
                name: "IX_Excursion_GuideProfileId",
                table: "Excursion");

            migrationBuilder.DropColumn(
                name: "GuideProfileId",
                table: "Excursion");

            migrationBuilder.CreateTable(
                name: "ImageScenes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SceneId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Width = table.Column<int>(type: "int", nullable: true),
                    Height = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImageScenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImageScenes_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PanoramaScenes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SceneId = table.Column<int>(type: "int", nullable: false),
                    PanoramaUrl = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PanoramaScenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PanoramaScenes_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VideoScenes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SceneId = table.Column<int>(type: "int", nullable: false),
                    VideoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DurationSeconds = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VideoScenes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VideoScenes_Scenes_SceneId",
                        column: x => x.SceneId,
                        principalTable: "Scenes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImageScenes_SceneId",
                table: "ImageScenes",
                column: "SceneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PanoramaScenes_SceneId",
                table: "PanoramaScenes",
                column: "SceneId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_VideoScenes_SceneId",
                table: "VideoScenes",
                column: "SceneId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImageScenes");

            migrationBuilder.DropTable(
                name: "PanoramaScenes");

            migrationBuilder.DropTable(
                name: "VideoScenes");

            migrationBuilder.AddColumn<int>(
                name: "GuideProfileId",
                table: "Excursion",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GuideProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    IsOrganization = table.Column<bool>(type: "bit", nullable: false),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    OrganizationName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GuideProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GuideProfiles_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Excursion_GuideProfileId",
                table: "Excursion",
                column: "GuideProfileId");

            migrationBuilder.CreateIndex(
                name: "IX_GuideProfiles_UserId",
                table: "GuideProfiles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Excursion_GuideProfiles_GuideProfileId",
                table: "Excursion",
                column: "GuideProfileId",
                principalTable: "GuideProfiles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_GuideProfiles_AuthorId",
                table: "Scenes",
                column: "AuthorId",
                principalTable: "GuideProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
