namespace WebShopApi.Models.Product;

public class ProductEditViewModel
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public List<IFormFile> Images { get; set; } = new();
}
