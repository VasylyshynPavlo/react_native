namespace WebShopApi.Models.Product;

public class ProductCreateViewModel
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public double Price { get; set; }
    public int CategoryId { get; set; }
    public List<IFormFile> Images { get; set; } = new();
}
