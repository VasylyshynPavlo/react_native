using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebShopApi.Data.Entities;
using WebShopApi.Data.Entities.Identity;

namespace WebShopApi.Data
{
    public class WebShopDbContext : IdentityDbContext<UserEntity, RoleEntity, long>
    {
        public WebShopDbContext(DbContextOptions<WebShopDbContext> options)
            : base(options) { }

        public DbSet<CategoryEntity> Categories { get; set; }
        public DbSet<ProductEntity> Products { get; set; }
        public DbSet<ProductImageEntity> ProductImages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<UserRoleEntity>(ur =>
            {
                ur.HasOne(ur => ur.Role)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(r => r.RoleId)
                    .IsRequired();

                ur.HasOne(ur => ur.User)
                    .WithMany(r => r.UserRoles)
                    .HasForeignKey(u => u.UserId)
                    .IsRequired();
            });

            builder.Entity<ProductEntity>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<ProductImageEntity>()
                .HasOne(img => img.Product)
                .WithMany(p => p.Images)
                .HasForeignKey(img => img.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<ProductImageEntity>()
                .Property(p => p.Image)
                .IsRequired()
                .HasMaxLength(255);
        }
    }
}
