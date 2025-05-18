using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using WebShopApi.Data.Entities.Identity;

namespace WebShopApi.Data.Entities;

[Table("tblProducts")]
public class ProductEntity
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    public string Name { get; set; } = string.Empty;

    [StringLength(4000)]
    public string? Description { get; set; }
    
    public double Price { get; set; }

    [ForeignKey("User")]
    public long UserId { get; set; }
    public virtual UserEntity? User { get; set; }

    [ForeignKey("Category")]
    public int CategoryId { get; set; }
    public virtual CategoryEntity? Category { get; set; }

    public virtual ICollection<ProductImageEntity> Images { get; set; } = new List<ProductImageEntity>();
}