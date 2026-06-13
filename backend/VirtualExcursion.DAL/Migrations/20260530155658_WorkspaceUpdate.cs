using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class WorkspaceUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Workspaces_Type",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "DescriptionLong",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "Inn",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "Ogrn",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "PassportNumber",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "PassportSeries",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "RegistrationCertificateUrl",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "TaxCertificateUrl",
                table: "Workspaces");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Workspaces");

            migrationBuilder.RenameColumn(
                name: "LegalName",
                table: "Workspaces",
                newName: "Country");

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Workspaces",
                type: "nvarchar(200)",
                maxLength: 200,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "City",
                table: "Workspaces");

            migrationBuilder.RenameColumn(
                name: "Country",
                table: "Workspaces",
                newName: "LegalName");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionLong",
                table: "Workspaces",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Inn",
                table: "Workspaces",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Ogrn",
                table: "Workspaces",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PassportNumber",
                table: "Workspaces",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PassportSeries",
                table: "Workspaces",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RegistrationCertificateUrl",
                table: "Workspaces",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaxCertificateUrl",
                table: "Workspaces",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Workspaces",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "personal");

            migrationBuilder.CreateIndex(
                name: "IX_Workspaces_Type",
                table: "Workspaces",
                column: "Type");
        }
    }
}
