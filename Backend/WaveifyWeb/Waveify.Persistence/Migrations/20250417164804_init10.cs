using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Waveify.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class init10 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tags_Songs_SongEntityId",
                table: "Tags");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Subscriptions_SubscriptionId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "AwardsEntity");

            migrationBuilder.DropIndex(
                name: "IX_Tags_SongEntityId",
                table: "Tags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LikedSongs",
                table: "LikedSongs");

            migrationBuilder.DropIndex(
                name: "IX_LikedSongs_UserId",
                table: "LikedSongs");

            migrationBuilder.DropColumn(
                name: "SongEntityId",
                table: "Tags");

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Songs",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "BPM",
                table: "Songs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CountAuditions",
                table: "Songs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Discriminator",
                table: "Songs",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MusicBoost",
                table: "Songs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Price",
                table: "Songs",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TypeBeat",
                table: "Songs",
                type: "text",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "LikedSongs",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "DrumKits",
                type: "character varying(250)",
                maxLength: 250,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddPrimaryKey(
                name: "PK_LikedSongs",
                table: "LikedSongs",
                columns: new[] { "UserId", "SongId" });

            migrationBuilder.CreateTable(
                name: "SongTags",
                columns: table => new
                {
                    SongEntityId = table.Column<Guid>(type: "uuid", nullable: false),
                    TagsId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SongTags", x => new { x.SongEntityId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_SongTags_Songs_SongEntityId",
                        column: x => x.SongEntityId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SongTags_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SongTags_TagsId",
                table: "SongTags",
                column: "TagsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Subscriptions_SubscriptionId",
                table: "Users",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Subscriptions_SubscriptionId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "SongTags");

            migrationBuilder.DropPrimaryKey(
                name: "PK_LikedSongs",
                table: "LikedSongs");

            migrationBuilder.DropColumn(
                name: "BPM",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "CountAuditions",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Discriminator",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "MusicBoost",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "Price",
                table: "Songs");

            migrationBuilder.DropColumn(
                name: "TypeBeat",
                table: "Songs");

            migrationBuilder.AddColumn<Guid>(
                name: "SongEntityId",
                table: "Tags",
                type: "uuid",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "Songs",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "LikedSongs",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AlterColumn<string>(
                name: "Title",
                table: "DrumKits",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "character varying(250)",
                oldMaxLength: 250);

            migrationBuilder.AddPrimaryKey(
                name: "PK_LikedSongs",
                table: "LikedSongs",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "AwardsEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SongId = table.Column<Guid>(type: "uuid", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AwardsEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AwardsEntity_Songs_SongId",
                        column: x => x.SongId,
                        principalTable: "Songs",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tags_SongEntityId",
                table: "Tags",
                column: "SongEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_LikedSongs_UserId",
                table: "LikedSongs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AwardsEntity_SongId",
                table: "AwardsEntity",
                column: "SongId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tags_Songs_SongEntityId",
                table: "Tags",
                column: "SongEntityId",
                principalTable: "Songs",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Subscriptions_SubscriptionId",
                table: "Users",
                column: "SubscriptionId",
                principalTable: "Subscriptions",
                principalColumn: "Id");
        }
    }
}
