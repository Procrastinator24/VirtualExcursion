using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class workspaceStatsDeleted : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExcursionsCount",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "MembersCount",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "ScenesCount",
                table: "Workspaces");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ExcursionsCount",
                table: "Workspaces",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MembersCount",
                table: "Workspaces",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ScenesCount",
                table: "Workspaces",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
