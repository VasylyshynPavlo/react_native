using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebShopApi.Data.Entities;

[Table("tblProductImages")]
public class ProductImageEntity
{
    [Key]
    public int Id { get; set; }

    [StringLength(255)]
    public string Image { get; set; } = string.Empty;

    [ForeignKey("Product")]
    public int ProductId { get; set; }
    public virtual ProductEntity? Product { get; set; }
}
