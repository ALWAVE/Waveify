using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Waveify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class init6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_TagEntity_TagEntityId",
                table: "Song");

            migrationBuilder.DropForeignKey(
                name: "FK_TagEntity_Songs_SongEntityId",
                table: "TagEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TagEntity",
                table: "TagEntity");

            migrationBuilder.RenameTable(
                name: "TagEntity",
                newName: "Tags");

            migrationBuilder.RenameColumn(
                name: "Rating",
                table: "Song",
                newName: "Dislike");

            migrationBuilder.RenameIndex(
                name: "IX_TagEntity_SongEntityId",
                table: "Tags",
                newName: "IX_Tags_SongEntityId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tags",
                table: "Tags",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_Tags_TagEntityId",
                table: "Song",
                column: "TagEntityId",
                principalTable: "Tags",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Songs_SongEntityId",
                table: "Tags",
                column: "SongEntityId",
                principalTable: "Songs",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Song_Tags_TagEntityId",
                table: "Song");

            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Songs_SongEntityId",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tags",
                table: "Tags");

            migrationBuilder.RenameTable(
                name: "Tags",
                newName: "TagEntity");

            migrationBuilder.RenameColumn(
                name: "Dislike",
                table: "Song",
                newName: "Rating");

            migrationBuilder.RenameIndex(
                name: "IX_Tags_SongEntityId",
                table: "TagEntity",
                newName: "IX_TagEntity_SongEntityId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TagEntity",
                table: "TagEntity",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Song_TagEntity_TagEntityId",
                table: "Song",
                column: "TagEntityId",
                principalTable: "TagEntity",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TagEntity_Songs_SongEntityId",
                table: "TagEntity",
                column: "SongEntityId",
                principalTable: "Songs",
                principalColumn: "Id");
        }
    }
}
