using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class excupd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Excursion",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Theme",
                table: "Excursion",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Excursion");

            migrationBuilder.DropColumn(
                name: "Theme",
                table: "Excursion");
        }
    }
}
