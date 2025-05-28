using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waveify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class init22 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "moderationStatus",
                table: "Songs",
                newName: "ModerationStatus");

            migrationBuilder.RenameColumn(
                name: "moderationStatus",
                table: "Song",
                newName: "ModerationStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ModerationStatus",
                table: "Songs",
                newName: "moderationStatus");

            migrationBuilder.RenameColumn(
                name: "ModerationStatus",
                table: "Song",
                newName: "moderationStatus");
        }
    }
}
