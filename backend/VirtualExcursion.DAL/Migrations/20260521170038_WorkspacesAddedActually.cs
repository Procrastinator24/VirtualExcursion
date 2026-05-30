using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class WorkspacesAddedActually : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WorkspaceId",
                table: "Scenes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkspaceId",
                table: "Excursion",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Workspaces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DescriptionShort = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DescriptionLong = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Type = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "personal"),
                    Website = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Phone = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    LegalName = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Inn = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Ogrn = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PassportSeries = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    PassportNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    RegistrationCertificateUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    TaxCertificateUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OwnerId = table.Column<int>(type: "int", nullable: false),
                    VerificationStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "NotSubmitted"),
                    VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VerifiedByUserId = table.Column<int>(type: "int", nullable: true),
                    VerifiedById = table.Column<int>(type: "int", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MembersCount = table.Column<int>(type: "int", nullable: false),
                    ExcursionsCount = table.Column<int>(type: "int", nullable: false),
                    ScenesCount = table.Column<int>(type: "int", nullable: false),
                    ShowContactInfo = table.Column<bool>(type: "bit", nullable: false),
                    ShowExhibits = table.Column<bool>(type: "bit", nullable: false),
                    ShowExcursions = table.Column<bool>(type: "bit", nullable: false),
                    ShowMe = table.Column<bool>(type: "bit", nullable: false),
                    ShowSite = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Workspaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Workspaces_Users_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Workspaces_Users_VerifiedById",
                        column: x => x.VerifiedById,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "WorkspacesMembers",
                columns: table => new
                {
                    WorkspaceId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false, defaultValue: "Editor"),
                    JoinedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    InvitedById = table.Column<int>(type: "int", nullable: true),
                    InvitationStatus = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true, defaultValue: "Accepted")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkspacesMembers", x => new { x.WorkspaceId, x.UserId });
                    table.ForeignKey(
                        name: "FK_WorkspacesMembers_Users_InvitedById",
                        column: x => x.InvitedById,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WorkspacesMembers_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WorkspacesMembers_Workspaces_WorkspaceId",
                        column: x => x.WorkspaceId,
                        principalTable: "Workspaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Scenes_WorkspaceId",
                table: "Scenes",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Excursion_WorkspaceId",
                table: "Excursion",
                column: "WorkspaceId");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_OwnerId",
                table: "Workspaces",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_Type",
                table: "Workspaces",
                column: "Type");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_VerificationStatus",
                table: "Workspaces",
                column: "VerificationStatus");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_VerifiedById",
                table: "Workspaces",
                column: "VerifiedById");

            migrationBuilder.CreateIndex(
                name: "IX_WorkspacesMembers_InvitedById",
                table: "WorkspacesMembers",
                column: "InvitedById");

            migrationBuilder.CreateIndex(
                name: "IX_WorkspacesMembers_UserId",
                table: "WorkspacesMembers",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Excursion_Workspaces_WorkspaceId",
                table: "Excursion",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_Scenes_Workspaces_WorkspaceId",
                table: "Scenes",
                column: "WorkspaceId",
                principalTable: "Workspaces",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Excursion_Workspaces_WorkspaceId",
                table: "Excursion");

            migrationBuilder.DropForeignKey(
                name: "FK_Scenes_Workspaces_WorkspaceId",
                table: "Scenes");

            migrationBuilder.DropTable(
                name: "WorkspacesMembers");

            migrationBuilder.DropTable(
                name: "Workspaces");

            migrationBuilder.DropIndex(
                name: "IX_Scenes_WorkspaceId",
                table: "Scenes");

            migrationBuilder.DropIndex(
                name: "IX_Excursion_WorkspaceId",
                table: "Excursion");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Scenes");

            migrationBuilder.DropColumn(
                name: "WorkspaceId",
                table: "Excursion");
        }
    }
}
