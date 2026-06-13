using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtualExcursion.DAL.Migrations
{
    /// <inheritdoc />
    public partial class userupd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Excursion_GuideProfiles_GuideProfileId",
                table: "Excursion");

            migrationBuilder.DropIndex(
                name: "IX_GuideProfiles_UserId",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.AddColumn<bool>(
                name: "IsAdmin",
                table: "Users",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "GuideProfileId",
                table: "Excursion",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Excursion_GuideProfiles_GuideProfileId",
                table: "Excursion");

            migrationBuilder.DropIndex(
                name: "IX_GuideProfiles_UserId",
                table: "GuideProfiles");

            migrationBuilder.DropColumn(
                name: "IsAdmin",
                table: "Users");

            migrationBuilder.AddColumn<int>(
                name: "Role",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "GuideProfileId",
                table: "Excursion",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GuideProfiles_UserId",
                table: "GuideProfiles",
                column: "UserId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Excursion_GuideProfiles_GuideProfileId",
                table: "Excursion",
                column: "GuideProfileId",
                principalTable: "GuideProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
