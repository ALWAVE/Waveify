using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waveify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class init21 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "moderationStatus",
                table: "Songs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "moderationStatus",
                table: "Song",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "moderationStatus",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "moderationStatus",
                table: "Song");
        }
    }
}
